import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

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
): SubmittableExtrinsic<"promise"> => {
	return api.tx.identity.provideJudgement(registrarIndex, target, judgment);
};
