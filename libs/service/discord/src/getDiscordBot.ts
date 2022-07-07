import { Client as DiscordClient, Intents } from "discord.js";

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
