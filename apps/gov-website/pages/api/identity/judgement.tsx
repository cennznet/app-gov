import { getToken } from "next-auth/jwt";

import { NEXTAUTH_SECRET } from "@app-gov/node/constants";
import { fetchRequiredRegistrars, withMethodGuard } from "@app-gov/node/utils";
import {
	fetchIdentityOf,
	getApiInstance,
	getProvideJudgementExtrinsic,
	isIdentityValueMatched,
	signAndSendPromise,
} from "@app-gov/service/cennznet";
import { CENNZ_NETWORK, DISCORD_BOT } from "@app-gov/service/constants";
import { getDiscordBot } from "@app-gov/service/discord";

export default withMethodGuard(
	async function identityConnectRoute(req, res) {
		const { address, twitterUsername, discordUsername } = req.body;

		try {
			const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);

			// 1. Check if user has a valid signed in session
			const token = await getToken({ req, secret: NEXTAUTH_SECRET });
			if (!token) {
				return res.status(401).json({ message: "Invalid `token`" });
			}

			// 2. Check the submitted identity details are matchted with what on chain
			const { info: identity } = await fetchIdentityOf(api, address);

			const isTwitterMatched = isIdentityValueMatched(
				twitterUsername,
				identity.twitter
			);
			const isDiscordMatched = isIdentityValueMatched(
				discordUsername,
				identity.discord
			);

			if (!isTwitterMatched || !isDiscordMatched) {
				return res.status(400).json({
					message:
						"Social channel usernames are mismatched compared to on-chain data",
				});
			}

			// 3. Provide judgement for feach social channel
			const { twitter: twitterRegistrar, discord: discordRegistrar } =
				await fetchRequiredRegistrars(api);

			const twitterExtrinsic = getProvideJudgementExtrinsic(
				api,
				address,
				twitterRegistrar.index,
				"KnownGood"
			);
			const discordExtrinsic = getProvideJudgementExtrinsic(
				api,
				address,
				discordRegistrar.index,
				"KnownGood"
			);

			await Promise.all([
				signAndSendPromise(twitterExtrinsic, twitterRegistrar.signer),
				signAndSendPromise(discordExtrinsic, discordRegistrar.signer),
			]);

			// 4. Assign user with a special role
			await assignDiscordRole(discordUsername);

			return res.json({ ok: true });
		} catch (error) {
			return res.status(error?.httpStatus ?? 500).json({
				message:
					error?.code === 50007
						? "DISCORD_MESSAGES_NOT_ALLOWED"
						: error?.message,
			});
		}
	},
	["POST"]
);

const assignDiscordRole = async (discordUsername: string) => {
	const [username, discriminator] = discordUsername.split("#");

	const discordBot = await getDiscordBot(DISCORD_BOT.Token);

	const guildCache = discordBot.guilds.cache.get(DISCORD_BOT.ServerId);
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
		(role) => role.id === DISCORD_BOT.IdentityRoleId
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
