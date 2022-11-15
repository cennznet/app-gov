import chalk from "chalk";

import { getApiInstance } from "@app-gov/service/cennznet";
import { CENNZ_NETWORK, MONGODB_URI } from "@app-gov/service/env-vars";
import { getMongoClient, ProposalModel } from "@app-gov/service/mongodb";
import { getLogger, handleNewProposalMessage } from "@app-gov/service/relayer";

module.exports = {
	command: "proposal-patch <start> <end>",
	desc: "Start a one-off [ProposalPatch] script to fill in missing proposals",
	async handler(args: { start: number; end: number }) {
		const logger = getLogger("ProposalPatch");
		logger.info(
			`Start process on ${chalk.magenta("%s")}...`,
			CENNZ_NETWORK.ChainName
		);

		try {
			const [cennzApi, mdbClient] = await Promise.all([
				getApiInstance(CENNZ_NETWORK.ChainSlug),
				getMongoClient(MONGODB_URI),
			]);

			const { start, end } = args;
			for (let i = start; i <= end; i++) {
				const proposalId = i;
				const proposal = await mdbClient
					.model<ProposalModel>("Proposal")
					.findOne({ proposalId });

				if (proposal?.status) {
					logger.info(
						"Proposal #%d: 🔴 ignored, status `%s`",
						proposalId,
						proposal.status
					);
					continue;
				}

				await handleNewProposalMessage(cennzApi, mdbClient, { proposalId });
				logger.info("Proposal #%d: 🟢 added", proposalId);
			}
			process.exit(0);
		} catch (error) {
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
