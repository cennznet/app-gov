import { GetStaticProps, NextPage } from "next";
import { useCallback } from "react";
import { If } from "react-extras";

import { resolveProposalJustification } from "@app-gov/node/utils";
import { MONGODB_URI } from "@app-gov/service/env-vars";
import { getMongoClient, ProposalModel } from "@app-gov/service/mongodb";
import {
	Header,
	Layout,
	ProposalBody,
	ProposalSidebar,
	ProposalVoteForm,
} from "@app-gov/web/components";
import { useProposalVoteForm } from "@app-gov/web/hooks";

export const getStaticPaths = async () => {
	const mdb = await getMongoClient(MONGODB_URI);
	const proposals = await mdb
		.model<ProposalModel>("Proposal")
		.find()
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
	const mdb = await getMongoClient(MONGODB_URI);
	const proposal = await mdb
		.model<ProposalModel>("Proposal")
		.findOne({ proposalId: pid })
		.lean();

	const justification = await resolveProposalJustification(
		proposal.justificationUri
	);

	if (!proposal)
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
		},
		revalidate: 600,
	};
};

interface ProposalProps {
	proposal: ProposalModel;
	justification: string;
}

const Proposal: NextPage<ProposalProps> = ({ proposal, justification }) => {
	const { proposalId, call, status } = proposal;

	const { onVote, onVeto } = useProposalVoteForm(proposalId);

	const onPass = useCallback(() => {
		onVote(true);
	}, [onVote]);
	const onReject = useCallback(() => {
		if (status === "Deliberation") onVote(false);
		if (status === "ReferendumDeliberation") onVeto();
	}, [onVeto, onVote, status]);

	return (
		<Layout.PageWrapper>
			<Header />
			<Layout.PageContent className="!max-w-4xl lg:!max-w-5xl">
				<Layout.PageHeader>Proposal #{proposalId}</Layout.PageHeader>
				<div className="grid grid-cols-3 gap-8">
					<div className="col-span-2 col-start-1">
						<ProposalBody.Justification justification={justification} />
						<ProposalBody.Call call={call} />
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
					<div className="col-start-3">
						<ProposalSidebar proposal={proposal} className="sticky top-12" />
					</div>
				</div>
			</Layout.PageContent>
		</Layout.PageWrapper>
	);
};

export default Proposal;
