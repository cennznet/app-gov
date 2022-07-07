import Discord from "discord.js";

const bot = new Discord.Client({
	partials: ["CHANNEL"],
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
	],
});

export const getDiscordBot = (token: string) =>
	new Promise((resolve, reject) => {
		try {
			bot.login(token);

			bot.on("ready", () => resolve(bot));
		} catch (error) {
			reject(error);
		}
	});
