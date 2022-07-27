import { getDiscordBot } from "./";

export const assignDiscordRole = async (
	discordUsername: string,
	token: string,
	serverId: string,
	identityRoleId: string
) => {
	try {
		const [username, discriminator] = discordUsername.split("#");

		const discordBot = await getDiscordBot(token);

		const guildCache = discordBot.guilds.cache.get(serverId);
		if (!guildCache)
			throw {
				code: "DISCORD_SERVER_NOT_FOUND",
				message: "Discord server cannot be found",
			};
		await guildCache.members.fetch();

		const user = guildCache.members.cache.find((user) => {
			return (
				user.user.username === username &&
				user.user.discriminator === discriminator
			);
		});
		if (!user)
			throw {
				code: "DISCORD_USER_NOT_FOUND",
				message: "Discord user cannot be found",
			};

		const identityRole = guildCache.roles.cache.find(
			(role) => role.id === identityRoleId
		);
		if (!identityRole)
			throw {
				code: "DISCORD_IDENTITY_ROLE_NOT_FOUND",
				message: "Discord role cannot be found",
			};

		await user.roles.add(identityRole);
		// Send a message to the user letting them know the verification has been successful
		await user.send(
			`***Welcome Citizen ${username}.*** \n\n` +
				`Thank you for doing your part in governing the CENNZnet blockchain!\n` +
				`You have been assigned the ${identityRole.name} role and can now participate in private channels.\n` +
				`Please note that for your safety, we will never ask for private keys, seed phrases or send links via DM.`
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error?.code === 50007)
			throw {
				code: "DISCORD_MESSAGES_NOT_ALLOWED",
				message: "Discord cannot send messages to this user",
			};

		throw error;
	}
};
