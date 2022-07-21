import { getDiscordBot } from "./";

export const assignDiscordRole = async (
	discordUsername: string,
	token: string,
	serverId: string,
	identityRoleId: string
) => {
	const [username, discriminator] = discordUsername.split("#");

	const discordBot = await getDiscordBot(token);

	const guildCache = discordBot.guilds.cache.get(serverId);
	if (!guildCache) throw { message: "DISCORD_SERVER_NOT_FOUND" };
	await guildCache.members.fetch();

	const user = guildCache.members.cache.find((user) => {
		return (
			user.user.username === username &&
			user.user.discriminator === discriminator
		);
	});
	if (!user) throw { message: "DISCORD_USER_NOT_FOUND" };

	const identityRole = guildCache.roles.cache.find(
		(role) => role.id === identityRoleId
	);
	if (!identityRole) throw { message: "DISCORD_IDENTITY_ROLE_NOT_FOUND" };

	await user.roles.add(identityRole);
	// Send a message to the user letting them know the verification has been successful
	await user.send(
		`***Welcome Citizen ${username}.*** \n\n` +
			`Thank you for doing your part in governing the CENNZnet blockchain!\n` +
			`You have been assigned the ${identityRole.name} role and can now participate in private channels.\n` +
			`Please note that for your safety, we will never ask for private keys, seed phrases or send links via DM.`
	);
};
