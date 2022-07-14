import { Api } from "@cennznet/api";
import { u64 } from "@cennznet/types";
import { Mongoose } from "mongoose";

import { ProposalModel } from "@app-gov/service/mongodb";

export const monitorNewProposal = async (
	api: Api,
	mdb: Mongoose,
	callback: (proposalId: number) => void
): Promise<void> => {
	const proposal = mdb.model<ProposalModel>("Proposal");
	const lastKnownId =
		Number(
			(await proposal.findOne().sort({ proposalId: "desc" }).exec())
				?.proposalId ?? -1
		) + 1;

	api.query.governance.nextProposalId(async (nextProposalId: u64) => {
		const endId = nextProposalId.toNumber();
		const proposalIds = [];
		for (let i = lastKnownId; i < endId; i++) proposalIds.push(i);
		proposalIds.forEach(callback);
	});
};
