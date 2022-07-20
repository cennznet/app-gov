import { Mongoose } from "mongoose";

import { ProposalModel } from "@app-gov/service/mongodb";

export const monitorProposalActivity = async (
	mdb: Mongoose,
	callback: (proposalId: number) => void
): Promise<void> => {
	// Find all proposals that are still active
	const proposals = await mdb
		.model<ProposalModel>("Proposal")
		.find({
			$or: [
				{ status: "Deliberation" },
				{ status: "ReferendumDeliberation" },
				{ status: "ApprovedWaitingEnactment" },
			],
		})
		.select("proposalId");

	proposals.forEach((proposal) => callback(proposal.proposalId));
};
