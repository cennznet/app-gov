/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client as DiscordClient, Intents } from "discord.js";
import type { InteractionWebhook } from "discord.js";

const bot = new DiscordClient({
	partials: ["CHANNEL", "MESSAGE"],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
	],
});

export const getDiscordBot = (token: string): Promise<DiscordClient> =>
	new Promise((resolve, reject) => {
		try {
			bot.login(token);

			bot.once("ready", () => resolve(bot));
		} catch (error) {
			reject(error);
		}
	});

export type DiscordWebhooks = [InteractionWebhook, InteractionWebhook];

export const getDiscordWebhooks = (
	token: string,
	channelIds: string[],
	webhookIds: string[]
): Promise<DiscordWebhooks> =>
	new Promise((resolve, reject) => {
		try {
			bot.login(token);

			bot.once("ready", async () => {
				const [proposalChannel, referendumChannel] = channelIds.map(
					(channelId) => bot.channels.cache.get(channelId)
				);

				const [proposalWebhook, referendumWebhook] = await Promise.all(
					[
						[proposalChannel, webhookIds[0]],
						[referendumChannel, webhookIds[1]],
					].map(async ([channel, webhookId]) => {
						const webhooks: InteractionWebhook[] = await (
							channel as any
						).fetchWebhooks();
						return webhooks.find((hook) => hook.id === webhookId);
					})
				);

				resolve([proposalWebhook, referendumWebhook] as DiscordWebhooks);
			});
		} catch (error) {
			reject(error);
		}
	});
