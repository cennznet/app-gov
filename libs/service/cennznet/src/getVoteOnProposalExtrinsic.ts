import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export const getVoteOnProposalExtrinsic = (
	api: Api,
	proposalId: number,
	vote: boolean
): SubmittableExtrinsic<"promise"> => {
	return api.tx.governance.voteOnProposal(proposalId, vote);
};
