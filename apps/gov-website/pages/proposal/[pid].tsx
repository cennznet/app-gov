import type { Api, SubmittableResult } from "@cennznet/api";
import type { UInt } from "@polkadot/types-codec";
import mongoose from "mongoose";
import type { GetStaticProps, NextPage } from "next";
import { useCallback, useState } from "react";
import { If } from "react-extras";

import { Proposal as ProposalModel } from "@app-gov/node/models";
import type {
	ProposalCall,
	ProposalInterface,
	ProposalVote,
} from "@app-gov/node/types";
import { getApiInstance } from "@app-gov/service/cennznet";
import { MONGODB_URI } from "@app-gov/service/constants";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	AccountSelect,
	Button,
	Header,
	Layout,
	ProposalDetailsDisplay,
} from "@app-gov/web/components";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";
import { Spinner } from "@app-gov/web/vectors";

export const getStaticPaths = async () => {
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);

	const nextProposalId = (
		(await api.query.governance.nextProposalId()) as UInt
	).toNumber();

	const proposalIds = [];

	for (let i = 0; i < nextProposalId; i++) proposalIds.push(String(i));

	return {
		paths: proposalIds.map((pid) => ({ params: { pid } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async (content) => {
	const connectMongoose = async () => {
		if (mongoose.connection.readyState >= 1) return;

		await mongoose.connect(MONGODB_URI);
	};

	await connectMongoose();
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);

	const proposalId = content.params.pid as string;
	const proposalCall = await fetchProposalCall(api, proposalId);
	const proposal = JSON.stringify(await ProposalModel.findOne({ proposalId }));

	return {
		props: {
			proposalId,
			proposal: JSON.parse(proposal),
			proposalCall,
		},
		revalidate: 600,
	};
};

interface ProposalProps {
	proposalId: string;
	proposal: ProposalInterface;
	proposalCall: ProposalCall;
}

const Proposal: NextPage<ProposalProps> = ({
	proposalId,
	proposal,
	proposalCall,
}) => {
	const { busy, onVoteClick } = useVote(proposalId);

	return (
		<Layout.PageWrapper>
			<Header />
			<Layout.PageContent>
				<Layout.PageHeader>Proposal #{proposalId}</Layout.PageHeader>

				<ProposalDetailsDisplay
					proposalDetails={proposal?.proposalDetails}
					proposalInfo={proposal?.proposalInfo}
					proposalStatus={proposal?.status}
					proposalCall={proposalCall}
				/>

				<If condition={!proposal || proposal?.status?.includes("Deliberation")}>
					<h2 className="font-display border-hero mt-12 border-b-2 text-2xl uppercase">
						Connect your wallet
					</h2>
					<p className="prose mb-8">
						Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
						labore dolor mollit commodo do anim incididunt sunt id pariatur elit
						tempor nostrud nulla eu proident ut id qui incididunt.
					</p>
					<div className="min-w-0">
						<AccountSelect required />
					</div>
				</If>

				<If condition={!!proposal}>
					<div
						className="mt-16 inline-flex w-full justify-center space-x-12"
						role="group"
					>
						<If condition={proposal?.status === "Deliberation"}>
							{["pass", "reject"].map((vote: ProposalVote, index) => (
								<Button
									key={index}
									size="medium"
									disabled={busy[vote]}
									className="w-1/4 text-center"
									variant={vote === "pass" ? "white" : "hero"}
									onClick={() => onVoteClick("proposal", vote)}
								>
									<div className="flex items-center justify-center">
										<If condition={busy[vote]}>
											<span className="mr-2">
												<Spinner />
											</span>
										</If>
										<span>{busy[vote] ? "Processing..." : vote}</span>
									</div>
								</Button>
							))}
						</If>

						<If condition={proposal?.status === "ReferendumDeliberation"}>
							<Button
								size="medium"
								disabled={busy.veto}
								className="w-1/4 text-center"
								onClick={() => onVoteClick("referendum", "veto")}
							>
								<div className="flex items-center justify-center">
									<If condition={busy.veto}>
										<span className="mr-2">
											<Spinner />
										</span>
									</If>
									<span>{busy.veto ? "Processing..." : "Veto"}</span>
								</div>
							</Button>
						</If>
					</div>
				</If>
			</Layout.PageContent>
		</Layout.PageWrapper>
	);
};

export default Proposal;

const fetchProposalCall = async (api: Api, proposalId: string) => {
	try {
		const extrinsicHash = (
			await api.query.governance.proposalCalls(proposalId)
		).toString();

		const { section, method, args } = api
			.createType("Call", extrinsicHash)
			.toHuman() as unknown as ProposalCall;

		return { section, method, args };
	} catch (error) {
		console.info(error.message);

		return {
			section: "undefined",
			method: "",
			args: {},
		};
	}
};

const useVote = (proposalId: string) => {
	const { api } = useCENNZApi();
	const { selectedAccount, wallet } = useCENNZWallet();
	const signer = wallet?.signer;

	const [busy, setBusy] = useState({
		pass: false,
		reject: false,
		veto: false,
	});

	const onVoteClick = useCallback(
		async (stage: "proposal" | "referendum", vote: ProposalVote) => {
			if (!api || !selectedAccount?.address || !signer) return;
			setBusy({ ...busy, [vote]: true });

			if (stage === "proposal")
				await api.tx.governance
					.voteOnProposal(proposalId, vote === "pass")
					.signAndSend(
						selectedAccount.address,
						{ signer },
						(result: SubmittableResult) => {
							const { txHash } = result;
							console.info("Transaction", txHash.toString());
						}
					);

			if (stage === "referendum")
				await api.tx.governance
					.voteAgainstReferendum(proposalId)
					.signAndSend(
						selectedAccount.address,
						{ signer },
						(result: SubmittableResult) => {
							const { txHash } = result;
							console.info("Transaction", txHash.toString());
						}
					);

			setBusy({
				pass: false,
				reject: false,
				veto: false,
			});
		},
		[api, selectedAccount?.address, signer, busy, proposalId]
	);

	return { busy, onVoteClick };
};
