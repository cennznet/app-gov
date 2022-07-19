import { AMQPError } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import {
	getLogger,
	monitorNewProposal,
	monitorProposalActivity,
} from "@app-gov/node/utils";
import { getApiInstance } from "@app-gov/service/cennznet";
import {
	BLOCK_POLLING_INTERVAL,
	CENNZ_NETWORK,
	MONGODB_URI,
	PROPOSAL_QUEUE,
	RABBITMQ_URI,
} from "@app-gov/service/env-vars";
import { getMongoClient } from "@app-gov/service/mongodb";
import { getQueueByName, getRabbitClient } from "@app-gov/service/rabbitmq";

module.exports = {
	command: "proposal-pub",
	desc: "Start a [ProposalPub] process",
	async handler() {
		const logger = getLogger("ProposalPub");
		logger.info(
			`Start process on ${chalk.magenta("%s")}...`,
			CENNZ_NETWORK.ChainName
		);

		try {
			const [cennzApi, amqClient, mdbClient] = await Promise.all([
				getApiInstance(CENNZ_NETWORK.ChainSlug),
				getRabbitClient(RABBITMQ_URI),
				getMongoClient(MONGODB_URI),
			]);

			const proposalQueue = await getQueueByName(
				amqClient,
				"Producer",
				PROPOSAL_QUEUE
			);

			let lastBlockPolled: number;
			cennzApi.rpc.chain.subscribeFinalizedHeads(async (head) => {
				const blockNumber = head.number.toNumber();
				if (
					lastBlockPolled &&
					blockNumber < lastBlockPolled + BLOCK_POLLING_INTERVAL
				)
					return;
				lastBlockPolled = blockNumber;
				logger.info(
					`Health check: 👌 ${chalk.green("ok")} @ ${chalk.gray("%s")}`,
					blockNumber
				);

				await monitorNewProposal(cennzApi, mdbClient, (proposalId) => {
					proposalQueue.publish(JSON.stringify({ proposalId }), {
						type: "proposal-new",
					});
				});

				await monitorProposalActivity(mdbClient, (proposalId) => {
					proposalQueue.publish(JSON.stringify({ proposalId }), {
						type: "proposal-activity",
					});
				});
			});
		} catch (error) {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
