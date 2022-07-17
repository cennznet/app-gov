import type { ProposalStatusInfo } from "@cennznet/types";

import { ProposalInfo } from "@app-gov/service/cennznet";

export interface ProposalModel extends Partial<ProposalInfo> {
	proposalId: number;
	status:
		| ProposalStatusInfo["type"]
		| "ReferendumDeliberation"
		| "ApprovedEnactment";
}
