import { ProposalInfo } from "@app-gov/service/cennznet";

export interface ProposalModel extends Partial<ProposalInfo> {
	proposalId: number;
}
