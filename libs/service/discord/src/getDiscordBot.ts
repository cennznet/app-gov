import { Client as DiscordClient, Intents } from "discord.js";
import type { InteractionWebhook } from "discord.js";

const bot = new DiscordClient({
	partials: ["CHANNEL"],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
	],
});

export const getDiscordBot = (token: string): Promise<DiscordClient> =>
	new Promise((resolve, reject) => {
		try {
			bot.login(token);

			bot.on("ready", () => resolve(bot));
		} catch (error) {
			reject(error);
		}
	});

export const getDiscordWebhook = (
	token: string,
	channelId: string,
	webhookId: string
): Promise<InteractionWebhook> =>
	new Promise((resolve, reject) => {
		try {
			bot.login(token);

			bot.on("ready", async () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const channel: any = bot.channels.cache.get(channelId);

				const webhook = await channel
					.fetchWebhooks()
					.then((hooks: InteractionWebhook[]) =>
						hooks.find((hook) => hook.id === webhookId)
					);

				resolve(webhook);
			});
		} catch (error) {
			reject(error);
		}
	});
