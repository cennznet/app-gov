import { AMQPError } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import { getLogger, monitorNewProposal } from "@app-gov/node/utils";
import { getApiInstance, waitForBlock } from "@app-gov/service/cennznet";
import { getMDBClient } from "@app-gov/service/mongodb";
import { getAMQClient, getQueueByName } from "@app-gov/service/rabbitmq";

import {
	BLOCK_POLLING_INTERVAL,
	CENNZ_NETWORK,
	MONGODB_URI,
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
				getAMQClient(RABBITMQ_URI),
				getMDBClient(MONGODB_URI),
			]);

			const polling = true;
			const proposalQueue = await getQueueByName(
				amqClient,
				CENNZ_NETWORK.chainName,
				"AppGov",
				"ProposalQueue"
			);

			monitorNewProposal(cennzApi, mdbClient, (proposalId) => {
				logger.info("Proposal #%d: Send to queue...", proposalId);
				proposalQueue.publish(JSON.stringify({ proposalId }), {
					type: "new-proposal",
				});
			});

			do {
				await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);
			} while (polling);
		} catch (error) {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
