import { ProposalInfo } from "@app-gov/service/cennznet";

export interface ProposalModel extends Partial<ProposalInfo> {
	proposalId: number;
	passVotes?: number;
	rejectVotes?: number;
	vetoPercentage?: number;
	discordProposalMessage?: string;
	discordReferendumMessage?: string;
}
