import { NEXTAUTH_SECRET } from "@gov-app/libs/constants";
import { withMethodGuard } from "@gov-app/libs/utils/withMethodGuard";
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
