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

			bot.once("error", (error) => reject(error));
		} catch (error) {
			reject(error);
		}
	});

export type DiscordWebhooks = [InteractionWebhook, InteractionWebhook];

export const getDiscordWebhooks = (
	token: string,
	channelIds: string[],
	webhookIds: string[]
): Promise<InteractionWebhook[]> =>
	new Promise((resolve, reject) => {
		try {
			bot.login(token);

			bot.once("ready", async () => {
				const webhooks = await Promise.all(
					channelIds
						.map((channelId, index) => [
							bot.channels.cache.get(channelId),
							webhookIds[index],
						])
						.map(async ([channel, webhookId], index) => {
							const webhooks: InteractionWebhook[] = await (
								channel as any
							).fetchWebhooks();
							const webhook = webhooks.find((hook) => hook.id === webhookId);

							if (!webhook)
								reject(`Unable to find webhook for channel at index ${index}`);

							return webhook as InteractionWebhook;
						})
				);

				resolve(webhooks);
			});

			bot.once("error", (error) => reject(error));
		} catch (error) {
			reject(error);
		}
	});
