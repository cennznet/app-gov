import { Api } from "@cennznet/api";
import { u64 } from "@cennznet/types";
import { Mongoose } from "mongoose";

export const monitorNewProposal = async (
	api: Api,
	mdbClient: Mongoose,
	callback: (proposalId: number) => void
): Promise<void> => {
	const proposal = mdbClient.model("Proposal");
	const lastKnownId = Number(
		(await proposal.findOne().sort({ id: "desc" }).exec())?.id ?? 0
	);

	api.query.governance.nextProposalId(async (nextProposalId: u64) => {
		const endId = nextProposalId.toNumber();
		const proposalIds = [];
		for (let i = lastKnownId; i < endId; i++) proposalIds.push(i);
		proposalIds.forEach(callback);
	});
};
