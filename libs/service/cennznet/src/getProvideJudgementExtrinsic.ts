import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { ISubmittableResult } from "@cennznet/types";

type Judgement =
	| "Unknown"
	| "FeePaid"
	| "Reasonable"
	| "KnownGood"
	| "OutOfDate"
	| "LowQuality";

export const getProvideJudgementExtrinsic = (
	api: Api,
	target: string,
	registrarIndex: number,
	judgment: Judgement
): SubmittableExtrinsic<"promise", ISubmittableResult> => {
	return api.tx.identity.provideJudgement(registrarIndex, target, judgment);
};
