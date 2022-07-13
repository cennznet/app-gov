import type { ProposalStatusInfo } from "@cennznet/types";

export interface ProposalModel {
	id: number;
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
	call: string;
	status:
		| ProposalStatusInfo["type"]
		| "ReferendumDeliberation"
		| "ApprovedEnactment";
}
