import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

import { MONGODB_SERVER } from "@app-gov/service/constants";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await mongoose.connect(MONGODB_SERVER);
		const Proposal = mongoose.model("Proposal");

		const { pid: proposalId } = req.query;
		const proposal = await Proposal.findOne({ proposalId });

		if (!proposal) return res.status(404);

		return res.status(200).json({ proposal });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
}

