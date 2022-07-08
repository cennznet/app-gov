import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export const getRequestJudgementExtrinsic = (
	api: Api,
	registrarIndex: number
): SubmittableExtrinsic<"promise"> => {
	return api.tx.identity.requestJudgement(registrarIndex, 0);
};
