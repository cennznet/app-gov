import chalk from "chalk";

import { getApiInstance, waitForBlock } from "@app-gov/service/cennznet";
import { getDiscordWebhooks } from "@app-gov/service/discord";
import {
	BLOCK_POLLING_INTERVAL,
	CENNZ_NETWORK,
	DISCORD_CHANNEL_IDS,
	DISCORD_RELAYER_BOT,
	DISCORD_WEBHOOK_IDS,
	MONGODB_URI,
} from "@app-gov/service/env-vars";
import { getMongoClient } from "@app-gov/service/mongodb";
import {
	getLogger,
	handleNewProposalMessage,
	handleProposalActivityMessage,
	monitorNewProposal,
	monitorProposalActivity,
} from "@app-gov/service/relayer";

module.exports = {
	command: "proposal-monitor",
	desc: "Start a [ProposalMonitor] process",
	async handler() {
		const logger = getLogger("ProposalMonitor");
		logger.info(
			`Start process on ${chalk.magenta("%s")}...`,
			CENNZ_NETWORK.ChainName
		);

		try {
			const [cennzApi, mdbClient, discordWebhooks] = await Promise.all([
				getApiInstance(CENNZ_NETWORK.ChainSlug),
				getMongoClient(MONGODB_URI),
				getDiscordWebhooks(
					DISCORD_RELAYER_BOT.Token,
					DISCORD_CHANNEL_IDS,
					DISCORD_WEBHOOK_IDS
				),
			]);

			do {
				await monitorNewProposal(cennzApi, mdbClient, async (proposalId) => {
					await handleNewProposalMessage(cennzApi, mdbClient, { proposalId });
				});

				await monitorProposalActivity(mdbClient, async (proposalId) => {
					await handleProposalActivityMessage(
						cennzApi,
						discordWebhooks,
						mdbClient,
						{ proposalId }
					);
				});

				await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL, (blockNumber) => {
					logger.info(
						`Health check: 👌 ${chalk.green("ok")} @ ${chalk.gray("%s")}`,
						blockNumber
					);
				});
				// eslint-disable-next-line no-constant-condition
			} while (true);
		} catch (error) {
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
