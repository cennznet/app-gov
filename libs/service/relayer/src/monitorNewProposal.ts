import { Api } from "@cennznet/api";
import { Mongoose } from "mongoose";
import { Logger } from "winston";

import { ProposalModel } from "@app-gov/service/mongodb";

export const monitorNewProposal = async (
	api: Api,
	mdb: Mongoose,
	logger: Logger,
	callback: (proposalId: number) => void
): Promise<void> => {
	const nextProposalId = await api.query.governance.nextProposalId();
	const proposal = mdb.model<ProposalModel>("Proposal");
	const lastKnownId =
		Number(
			(await proposal.findOne().sort({ proposalId: "desc" }).exec())
				?.proposalId ?? -1
		) + 1;
	const endId = nextProposalId.toJSON() as number;
	logger.info(JSON.stringify({ lastKnownId, endId }));
	const proposalIds = [];
	for (let i = lastKnownId; i < endId; i++) proposalIds.push(i);
	proposalIds.forEach(callback);
};
