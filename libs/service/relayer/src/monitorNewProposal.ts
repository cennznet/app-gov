import { Api } from "@cennznet/api";
import { Mongoose } from "mongoose";

import { ProposalModel } from "@app-gov/service/mongodb";

export const monitorNewProposal = async (
	api: Api,
	mdb: Mongoose,
	callback: (proposalId: number) => void
): Promise<void> => {
	const nextProposalId = await api.query.governance.nextProposalId();
	if (nextProposalId.toString() === "0") return;

	const proposal = mdb.model<ProposalModel>("Proposal");
	const lastKnownId =
		Number(
			(await proposal.findOne().sort({ proposalId: "desc" }).exec())
				?.proposalId ?? -1
		) + 1;
	const endId = nextProposalId.toJSON() as number;
	const proposalIds = [];
	for (let i = lastKnownId; i < endId; i++) proposalIds.push(i);
	proposalIds.forEach(callback);
};
