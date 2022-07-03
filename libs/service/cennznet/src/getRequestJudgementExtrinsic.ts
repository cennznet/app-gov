import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { ISubmittableResult } from "@cennznet/types";

export const getRequestJudgementExtrinsic = (
	api: Api,
	registrarIndex: number
): SubmittableExtrinsic<"promise", ISubmittableResult> => {
	return api.tx.identity.requestJudgement(registrarIndex, 0);
};
