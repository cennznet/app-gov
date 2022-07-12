import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export const getSubmitProposalExtrinsic = (
	api: Api,
	justificationUrl: string,
	enactmentDelay: number,
	functionCall: [string, string, ...string[]] | SubmittableExtrinsic<"promise">
): SubmittableExtrinsic<"promise"> => {
	let extrinsic = functionCall;

	if (Array.isArray(functionCall)) {
		const [section, method, ...args] = functionCall;
		extrinsic = api.tx[section][method](...args);
	}

	return api.tx.governance.submitProposal(
		api.createType("Call", extrinsic).toHex(),
		justificationUrl,
		enactmentDelay
	);
};
