import { Api } from "@cennznet/api";

type ProposalStatusRaw =
	| "Deliberation" // Council is deliberating
	| "ReferendumDeliberation" // Referendum is in progress, CENNZ holders deliberating
	| "ApprovedWaitingEnactment" // referendum approved, awaiting enactment
	| "ApprovedEnactmentCancelled" // Proposal was approved but enactment cancelled
	| `{"approvedEnacted":${boolean}}` // Proposal approved and enacted (success/fail)
	| "Disapproved" // The council voted against this proposal
	| "ReferendumVetoed"; // The proposal was voted against during the referendum phase

type ProposalStatus =
	| Omit<ProposalStatusRaw, `{"approvedEnacted":${boolean}}`>
	| "ApprovedEnacted"
	| "ApprovedFailedEnactment";

export const FINALIZED_STATES: Array<ProposalStatus> = [
	"Disapproved",
	"ReferendumVetoed",
	"ApprovedEnactmentCancelled",
	"ApprovedEnacted",
	"ApprovedFailedEnactment",
];

export interface ProposalInfo {
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
	status: ProposalStatus;
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
	const [proposalsResult, proposalCallsResult, status] = await Promise.all([
		api.query.governance.proposals(proposalId),
		api.query.governance.proposalCalls(proposalId),
		fetchProposalStatus(api, proposalId),
	]);

	const proposalInfo = proposalsResult.toJSON() as unknown as ProposalInfo;
	const proposalCall: string = proposalCallsResult.toString();

	if (!proposalInfo) return;

	const justificationUri = api
		.createType("Vec<u8>", proposalInfo.justificationUri)
		.toHuman() as string;
	const isValidUri = justificationUri.indexOf("https://") === 0;

	if (!isValidUri) return;

	// Proposal call of "0x" means no call
	if (proposalCall === "0x")
		return {
			...proposalInfo,
			status,
			justificationUri,
		};

	let call;
	try {
		call = api.createType("Call", proposalCall).toHuman() as Record<
			string,
			unknown
		>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// Catch error creating type for `system.setCode`
		if (!error?.message.includes("[123, 34]")) throw error;
		call = {
			section: "system",
			method: "setCode",
			args: { code: "<omitted>" },
		};
	}

	return {
		...proposalInfo,
		call,
		status,
		justificationUri,
	};
};

export const fetchProposalStatus = async (
	api: Api,
	proposalId: number
): Promise<ProposalStatus> => {
	const proposalStatus = (
		await api.query.governance.proposalStatus(proposalId)
	).toString() as ProposalStatusRaw;

	if (proposalStatus.indexOf("approvedEnacted") >= 0) {
		const enacted = JSON.parse(proposalStatus).approvedEnacted;
		return enacted ? "ApprovedEnacted" : "ApprovedFailedEnactment";
	}

	return proposalStatus;
};
