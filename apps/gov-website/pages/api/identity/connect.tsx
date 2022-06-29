import { NEXTAUTH_SECRET } from "@app-gov/node/constants";
import { withMethodGuard } from "@app-gov/node/utils";
import { getToken } from "next-auth/jwt";

export default withMethodGuard(
	async function identityConnectRoute(req, res) {
		const { address, twitterUsername, discordUsername } = req.body;
		const token = await getToken({ req, secret: NEXTAUTH_SECRET });

		if (!token) {
			res.status(401).json({ message: "Invalid `token` value" });
			return;
		}

		console.log({
			address,
			twitterUsername,
			discordUsername,
			token,
		});

		return res.json({ ok: true });
	},
	["POST"]
);
