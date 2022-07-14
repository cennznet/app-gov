import type { ProposalStatusInfo } from "@cennznet/types";

export interface ProposalModel {
	proposalId: number;
	sponsor?: string;
	justificationUri?: string;
	enactmentDelay?: number;
	call?: Record<string, unknown>;
	status:
		| ProposalStatusInfo["type"]
		| "ReferendumDeliberation"
		| "ApprovedEnactment";
}
