import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export const getSubmitProposalExtrinsic = (
	api: Api,
	functionCall: [string, string, ...string[]],
	justificationUrl: string,
	enactmentDelay: number
): SubmittableExtrinsic<"promise"> => {
	const [section, method, ...args] = functionCall;
	const call = api.createType("Call", api.tx[section][method](...args)).toHex();

	return api.tx.governance.submitProposal(
		call,
		justificationUrl,
		enactmentDelay
	);
};
