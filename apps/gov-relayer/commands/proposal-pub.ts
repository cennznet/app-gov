import { AMQPError } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import { getLogger, monitorNewProposal } from "@app-gov/node/utils";
import { getApiInstance } from "@app-gov/service/cennznet";
import { getMongoClient } from "@app-gov/service/mongodb";
import { getQueueByName, getRabbitClient } from "@app-gov/service/rabbitmq";

import {
	CENNZ_NETWORK,
	MONGODB_URI,
	PROPOSAL_QUEUE,
	RABBITMQ_URI,
} from "../constants";

module.exports = {
	command: "proposal-pub",
	desc: "Start a [ProposalPub] process",
	async handler() {
		const logger = getLogger("ProposalPub");
		logger.info(
			`Start process on ${chalk.magenta("%s")}...`,
			CENNZ_NETWORK.chainTitle
		);

		try {
			const [cennzApi, amqClient, mdbClient] = await Promise.all([
				getApiInstance(CENNZ_NETWORK.chainName),
				getRabbitClient(RABBITMQ_URI),
				getMongoClient(MONGODB_URI),
			]);

			const proposalQueue = await getQueueByName(
				amqClient,
				"Producer",
				PROPOSAL_QUEUE
			);

			monitorNewProposal(cennzApi, mdbClient, (proposalId) => {
				logger.info("Proposal #%d: Send to queue...", proposalId);
				proposalQueue.publish(JSON.stringify({ proposalId }), {
					type: "proposal-new",
				});
			});
		} catch (error) {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
