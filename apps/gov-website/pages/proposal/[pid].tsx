import { VoidFn } from "@cennznet/api/types";
import { GetStaticProps, NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { If } from "react-extras";

import { resolveProposalJustification } from "@app-gov/node/utils";
import {
	fetchProposalInfo,
	fetchProposalStatus,
	fetchProposalVetoPercentage,
	fetchProposalVetoThreshold,
	fetchProposalVotePercentage,
	fetchProposalVotes,
	FINALIZED_STATES,
	getApiInstance,
	subscribeFinalizedHeads,
} from "@app-gov/service/cennznet";
import {
	BLOCK_POLLING_INTERVAL,
	CENNZ_NETWORK,
	MONGODB_URI,
} from "@app-gov/service/env-vars";
import { getMongoClient, ProposalModel } from "@app-gov/service/mongodb";
import {
	Header,
	Layout,
	ProposalBody,
	ProposalSidebar,
	ProposalVoteForm,
	ProposalVoteFormDialog,
	useTransactionDialog,
} from "@app-gov/web/components";
import { useProposalVoteForm } from "@app-gov/web/hooks";
import { useCENNZApi } from "@app-gov/web/providers";

export const getStaticPaths = async () => {
	const mdb = await getMongoClient(MONGODB_URI);
	const proposals = await mdb
		.model<ProposalModel>("Proposal")
		.find({ status: { $ne: null } })
		.sort("-proposalId");

	return {
		paths: proposals.map((proposal) => ({
			params: { pid: proposal.proposalId.toString() },
		})),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const {
		params: { pid },
	} = context;
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);
	const mdb = await getMongoClient(MONGODB_URI);
	const proposal = await mdb
		.model<ProposalModel>("Proposal")
		.findOne({ proposalId: pid })
		.lean();

	if (!proposal?.justificationUri)
		return {
			notFound: true,
		};

	const justification = await resolveProposalJustification(
		proposal.justificationUri
	);

	const vetoThreshold = await fetchProposalVetoThreshold(api);

	if (!proposal || !justification)
		return {
			notFound: true,
		};

	return {
		props: {
			proposal: {
				...proposal,
				_id: proposal._id.toString(),
			},
			justification,
			vetoThreshold,
		},
		revalidate: 300,
	};
};

interface ProposalProps {
	proposal: ProposalModel;
	justification: string;
	vetoThreshold: string;
}

const Proposal: NextPage<ProposalProps> = ({
	proposal: initialProposal,
	vetoThreshold,
	justification,
}) => {
	const proposal = useProposal(initialProposal);
	const { proposalId, call, status } = proposal;

	const { open, openDialog, closeDialog } = useTransactionDialog();
	const { onVote, onVeto, formState } = useProposalVoteForm(proposalId);

	const onPass = useCallback(() => {
		openDialog();
		onVote(true);
	}, [onVote, openDialog]);
	const onReject = useCallback(() => {
		openDialog();
		if (status === "Deliberation") onVote(false);
		if (status === "ReferendumDeliberation") onVeto();
	}, [onVeto, onVote, openDialog, status]);

	const onDialogDismiss = useCallback(() => {
		closeDialog();
	}, [closeDialog]);

	useEffect(() => {
		if (formState?.status === "Cancelled") closeDialog();
	}, [closeDialog, formState?.status]);

	const onDialogClose = useCallback(() => {
		if (!formState?.status || formState?.status === "Cancelled") return;
		onDialogDismiss();
	}, [onDialogDismiss, formState?.status]);

	return (
		<Layout.PageWrapper>
			<Header />
			<Layout.PageContent className="!max-w-4xl lg:!max-w-5xl">
				<Layout.PageHeader>Proposal #{proposalId}</Layout.PageHeader>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div className="lg:col-start-3 lg:row-start-1">
						<ProposalSidebar
							proposal={proposal}
							className="sticky top-12"
							vetoThreshold={vetoThreshold}
						/>
					</div>
					<div className="grid gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-1">
						<ProposalBody.Justification justification={justification} />

						<If condition={!!call}>
							<ProposalBody.Call call={call} />
						</If>

						<If
							condition={
								status === "Deliberation" || status === "ReferendumDeliberation"
							}
						>
							<ProposalVoteForm
								proposal={proposal}
								onPass={onPass}
								onReject={onReject}
							/>
						</If>
					</div>
				</div>
				<ProposalVoteFormDialog
					open={open}
					formState={formState}
					onClose={onDialogClose}
					onDismiss={onDialogDismiss}
					proposalStatus={status}
				/>
			</Layout.PageContent>
		</Layout.PageWrapper>
	);
};

export default Proposal;

const useProposal = (initialProposal: ProposalModel) => {
	const { api } = useCENNZApi();
	const { proposalId } = initialProposal;
	const [proposal, setProposal] = useState<ProposalModel>(initialProposal);

	useEffect(() => {
		if (!api) return;
		let unsubscribeFn: VoidFn;
		subscribeFinalizedHeads(api, BLOCK_POLLING_INTERVAL, async () => {
			const proposalStatus = await fetchProposalStatus(api, proposalId);

			if (FINALIZED_STATES.includes(proposalStatus))
				return setProposal((proposal) => ({
					...proposal,
					status: proposalStatus,
				}));

			const [proposalInfo, proposalVotes, vetoPercentage] = await Promise.all([
				fetchProposalInfo(api, proposalId),
				fetchProposalVotes(api, proposalId),
				fetchProposalVetoPercentage(api, proposalId),
			]);

			const votePercentage = await fetchProposalVotePercentage(
				api,
				proposalId,
				proposalVotes
			);

			setProposal({
				proposalId,
				...proposalInfo,
				...proposalVotes,
				votePercentage,
				vetoPercentage,
			});
		}).then((unsubscribe) => (unsubscribeFn = unsubscribe));

		return () => unsubscribeFn?.();
	}, [api, proposalId]);

	return proposal;
};
