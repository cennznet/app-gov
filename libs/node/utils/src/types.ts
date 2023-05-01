export interface ProposalDetails {
	title: string;
	description: string;
}

export interface ProposalInfo {
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
}

export type ProposalVote = "pass" | "reject" | "veto";

export interface ProposalInterface {
	discordMessageId: string;
	proposalId: number;
	proposalInfo: ProposalInfo;
	proposalDetails: ProposalDetails;
	passVotes: number;
	rejectVotes: number;
	state: "Created" | "InfoFetched" | "DetailsFetched" | "DiscordSent" | "Done";
	status: "Pending" | "Failed" | "Skipped" | "Aborted" | ProposalStatus;
}

export type ProposalStatusRaw =
	| "Deliberation" // Council is deliberating
	| "ReferendumDeliberation" // Referendum is in progress, CENNZ holders deliberating
	| "ApprovedWaitingEnactment" // referendum approved, awaiting enactment
	| "ApprovedEnactmentCancelled" // Proposal was approved but enactment cancelled
	| `{"approvedEnacted":${boolean}}` // Proposal approved and enacted (success/fail)
	| "Disapproved" // The council voted against this proposal
	| "ReferendumVetoed"; // The proposal was voted against during the referendum phase

export type ProposalStatus =
	| Omit<ProposalStatusRaw, `{"approvedEnacted":${boolean}}`>
	| "ApprovedEnacted"
	| "ApprovedFailedEnactment";

export interface ProposalCall {
	method: string;
	section: string;
	args: Record<string, string>;
}
