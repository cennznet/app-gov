import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import { getApiInstance } from "@app-gov/service/cennznet";
import { getDiscordWebhooks } from "@app-gov/service/discord";
import {
	CENNZ_NETWORK,
	DISCORD_CHANNEL_IDS,
	DISCORD_RELAYER_BOT,
	DISCORD_WEBHOOK_IDS,
	MESSAGE_MAX_RETRY,
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
import {
	getLogger,
	handleNewProposalMessage,
	handleProposalActivityMessage,
} from "@app-gov/service/relayer";

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

			const discordWebhooks = await getDiscordWebhooks(
				DISCORD_RELAYER_BOT.Token,
				DISCORD_CHANNEL_IDS,
				DISCORD_WEBHOOK_IDS
			);

			const onMessage = async (message: AMQPMessage) => {
				const bodyString = message.bodyString();
				const { type } = message.properties;
				if (!bodyString || !type) return;
				const body = JSON.parse(bodyString);

				try {
					switch (type) {
						case "proposal-new":
							await handleNewProposalMessage(cennzApi, mdbClient, body);
							break;

						case "proposal-activity":
							await handleProposalActivityMessage(
								cennzApi,
								discordWebhooks,
								mdbClient,
								body
							);
							break;
					}
				} catch (error) {
					logger.error("%s", error);
					const { type } = message.properties;
					if (type === "proposal-new") {
						const result = await requeueMessage(
							proposalQueue,
							message,
							MESSAGE_MAX_RETRY
						);
						logger.info(`Proposal #%d: ${result}`, body.proposalId);
					}

					if (type === "proposal-activity") {
						logger.info(`Proposal #%d: ❌ skipped`, body.proposalId);
					}
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
