import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import { getLogger, handleNewProposalMessage } from "@app-gov/node/utils";
import { getApiInstance } from "@app-gov/service/cennznet";
import {
	CENNZ_NETWORK,
	MESSAGE_MAX_RETRY,
	MESSAGE_TIMEOUT,
	MONGODB_URI,
	PROPOSAL_QUEUE,
	RABBITMQ_URI,
} from "@app-gov/service/env-vars";
import { getMongoClient } from "@app-gov/service/mongodb";
import {
	getQueueByName,
	getRabbitClient,
	requeueMessage,
} from "@app-gov/service/rabbitmq";

module.exports = {
	command: "proposal-sub",
	desc: "Start a [ProposalSub] process",
	async handler() {
		const logger = getLogger("ProposalSub");
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
				"Consumer",
				PROPOSAL_QUEUE
			);

			const onMessage = async (message: AMQPMessage) => {
				const bodyString = message.bodyString();
				const { type } = message.properties;
				if (!bodyString || !type) return;
				const body = JSON.parse(bodyString);

				try {
					switch (type) {
						case "proposal-new":
							const abortSignal = (AbortSignal as any).timeout(MESSAGE_TIMEOUT);
							await handleNewProposalMessage(
								cennzApi,
								mdbClient,
								body,
								abortSignal
							);
							break;
					}
				} catch (error) {
					logger.error("%s", error);
					const result = await requeueMessage(
						proposalQueue,
						message,
						MESSAGE_MAX_RETRY
					);
					logger.info(`Proposal #%d: ${result}`, body.proposalId);
				}
				await message.ack();
			};

			proposalQueue.subscribe({ noAck: false }, onMessage);
		} catch (error) {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
