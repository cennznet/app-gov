import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export const getVoteAgainstReferendumExtrinsic = (
	api: Api,
	proposalId: number
): SubmittableExtrinsic<"promise"> => {
	return api.tx.governance.voteAgainstReferendum(proposalId);
};
