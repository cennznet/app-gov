import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export const getSubmitProposalExtrinsic = (
	api: Api,
	justificationUrl: string,
	enactmentDelay: number,
	functionCall: [string, string, ...string[]]
): SubmittableExtrinsic<"promise"> => {
	const [section, method, ...args] = functionCall;
	const call = api.createType("Call", api.tx[section][method](...args));

	return api.tx.governance.submitProposal(
		call.toHex(),
		justificationUrl,
		enactmentDelay
	);
};
