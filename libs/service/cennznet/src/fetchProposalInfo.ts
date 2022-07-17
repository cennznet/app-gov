import { Api } from "@cennznet/api";

export interface ProposalInfo {
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
	call?: Record<string, unknown>;
}

/**
 * Fetches a proposal details also decode the call value
 *
 * @param {Api} api
 * @param {number} proposalId
 * @return {(Promise<ProposalInfo|void>)}
 */
export const fetchProposalInfo = async (
	api: Api,
	proposalId: number
): Promise<ProposalInfo | void> => {
	const [proposalsResult, proposalCallsResult] = await Promise.all([
		api.query.governance.proposals(proposalId),
		api.query.governance.proposalCalls(proposalId),
	]);

	const proposalInfo = proposalsResult.toJSON() as unknown as ProposalInfo;
	const proposalCall: string = proposalCallsResult.toString();

	if (!proposalInfo) return;

	let call;

	try {
		call = api.createType("Call", proposalCall).toHuman() as Record<
			string,
			unknown
		>;
		// eslint-disable-next-line no-empty
	} catch (error) {}

	if (!call) return;

	return {
		...proposalInfo,
		justificationUri: api
			.createType("Vec<u8>", proposalInfo.justificationUri)
			.toHuman() as string,
		call,
	};
};
