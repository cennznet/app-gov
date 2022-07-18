import type { ProposalStatusInfo } from "@cennznet/types";

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

export type ProposalStatus =
	| ProposalStatusInfo["type"]
	| "ReferendumDeliberation";

export interface ProposalCall {
	method: string;
	section: string;
	args: Record<string, string>;
}
