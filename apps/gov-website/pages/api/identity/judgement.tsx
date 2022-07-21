import { getToken } from "next-auth/jwt";

import { fetchRequiredRegistrars, withMethodGuard } from "@app-gov/node/utils";
import {
	fetchIdentityOf,
	getApiInstance,
	getProvideJudgementExtrinsic,
	isIdentityValueMatched,
	signAndSend,
} from "@app-gov/service/cennznet";
import { assignDiscordRole } from "@app-gov/service/discord";
import {
	CENNZ_NETWORK,
	DISCORD_WEBSITE_BOT,
	NEXTAUTH_SECRET,
} from "@app-gov/service/env-vars";

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
				signAndSend([twitterExtrinsic, twitterRegistrar.signer]),
				signAndSend([discordExtrinsic, discordRegistrar.signer]),
			]);

			// 4. Assign user with a special role
			if (DISCORD_WEBSITE_BOT.Token)
				await assignDiscordRole(
					discordUsername,
					DISCORD_WEBSITE_BOT.Token,
					DISCORD_WEBSITE_BOT.ServerId,
					DISCORD_WEBSITE_BOT.IdentityRoleId
				);

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
