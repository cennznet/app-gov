import { Api } from "@cennznet/api";

type PropsalStatus =
	| "Deliberation" // Council is deliberating
	| "ReferendumDeliberation" // Referendum is in progress, CENNZ holders deliberating
	| "ApprovedWaitingEnactment" // referendum approved, awaiting enactment
	| "ApprovedEnacted" // Proposal approved and enacted (success/fail)
	| "ApprovedEnactmentCancelled" // Proposal was approved but enactment cancelled
	| "Disapproved" // The council voted against this proposal
	| "ReferendumVetoed"; // The proposal was voted against during the referendum phase

export interface ProposalInfo {
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
	status: PropsalStatus;
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
	const [proposalsResult, proposalCallsResult, proposalStatus] =
		await Promise.all([
			api.query.governance.proposals(proposalId),
			api.query.governance.proposalCalls(proposalId),
			api.query.governance.proposalStatus(proposalId),
		]);

	const proposalInfo = proposalsResult.toJSON() as unknown as ProposalInfo;
	const proposalCall: string = proposalCallsResult.toString();
	let status = proposalStatus.toString() as PropsalStatus;
	// for "ApprovedEnacted", the response is in JSON form `{"approvedEnacted":false}`
	if (status.indexOf("approvedEnacted") >= 0) status = "ApprovedEnacted";

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
		status,
	};
};
