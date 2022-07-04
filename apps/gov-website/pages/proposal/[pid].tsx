import type { SubmittableResult } from "@cennznet/api";
import type { NextPage, NextPageContext } from "next";
import { useCallback, useEffect, useState } from "react";
import { If } from "react-extras";

import type { ProposalInterface, ProposalVote } from "@app-gov/node/types";
import {
	Button,
	Header,
	Layout,
	ProposalDetailsDisplay,
	WalletSelect,
} from "@app-gov/web/components";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";
import { fetchProposal } from "@app-gov/web/utils";
import { Spinner } from "@app-gov/web/vectors";

export const getServerSideProps = (context: NextPageContext) => {
	return {
		props: {
			proposalId: context.query.pid,
		},
	};
};

interface ProposalProps {
	proposalId: string;
}

const Proposal: NextPage<ProposalProps> = ({ proposalId }) => {
	const proposal = useProposal(proposalId);
	const { busy, onVoteClick } = useVote(proposalId);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display mb-6 text-center text-6xl uppercase">
					Proposal #{proposalId}
				</h1>

				<If condition={!proposal || proposal?.status?.includes("Deliberation")}>
					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your wallet
					</h2>
					<p className="mb-8">
						Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
						labore dolor mollit commodo do anim incididunt sunt id pariatur elit
						tempor nostrud nulla eu proident ut id qui incididunt.
					</p>
					<div className="mb-12 min-w-0">
						<WalletSelect required />
					</div>
				</If>

				<If condition={!proposal}>
					<Spinner className="m-auto h-8 w-8 animate-spin" />
				</If>

				<If condition={!!proposal}>
					<ProposalDetailsDisplay
						proposalDetails={proposal?.proposalDetails}
						proposalInfo={proposal?.proposalInfo}
						proposalStatus={proposal?.status}
					/>

					<div
						className="mt-16 inline-flex w-full justify-center space-x-12"
						role="group"
					>
						<If condition={proposal?.status === "Deliberation"}>
							{["pass", "reject"].map((vote: ProposalVote, index) => (
								<Button
									size="medium"
									disabled={busy[vote]}
									className="w-1/4 text-center"
									onClick={() => onVoteClick("proposal", vote)}
									key={index}
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
			</div>
		</Layout>
	);
};

export default Proposal;

const useProposal = (proposalId: string): ProposalInterface => {
	const [proposal, setProposal] = useState<ProposalInterface>();

	useEffect(() => {
		if (!proposalId) return;

		fetchProposal(proposalId).then(({ proposal }) => setProposal(proposal));
	}, [proposalId]);

	return proposal;
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
