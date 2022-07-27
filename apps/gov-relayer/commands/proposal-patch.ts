import { AMQPError } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import {
	CENNZ_NETWORK,
	MONGODB_URI,
	PROPOSAL_QUEUE,
	RABBITMQ_URI,
} from "@app-gov/service/env-vars";
import { getMongoClient, ProposalModel } from "@app-gov/service/mongodb";
import { getQueueByName, getRabbitClient } from "@app-gov/service/rabbitmq";
import { getLogger } from "@app-gov/service/relayer";

module.exports = {
	command: "proposal-patch <start> <end>",
	desc: "Start a one-off [ProposalPatch] script to fill in missing proposals",
	async handler(args) {
		const logger = getLogger("ProposalPatch");
		logger.info(
			`Start process on ${chalk.magenta("%s")}...`,
			CENNZ_NETWORK.ChainName
		);

		try {
			const [amqClient, mdbClient] = await Promise.all([
				getRabbitClient(RABBITMQ_URI),
				getMongoClient(MONGODB_URI),
			]);

			const proposalQueue = await getQueueByName(
				amqClient,
				"Producer",
				PROPOSAL_QUEUE
			);

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
				await proposalQueue.publish(JSON.stringify({ proposalId }), {
					type: "proposal-new",
				});
				logger.info("Proposal #%d: 🟢 added", proposalId);
			}
			process.exit(0);
		} catch (error) {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
