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
import { CENNZ_NETWORK } from "@app-gov/service/constants";

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

			// 4. Assign user with a special role in Discord
			// TODO

			return res.json({ ok: true });
		} catch (error) {
			return res.status(500).json({ message: error?.message });
		}
	},
	["POST"]
);
