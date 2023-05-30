import { withMethodGuard } from "@app-gov/node/utils";
import { REVALIDATE_SECRET } from "@app-gov/service/env-vars";

export default withMethodGuard(
	async function revalidateRoute(req, res) {
		try {
			const { pid, secret } = req.query;

			if (secret !== REVALIDATE_SECRET)
				return res
					.status(401)
					.json({ revalidated: false, message: "Invalid secret" });

			await res.revalidate(`/proposal/${pid}`);
			return res.json({ revalidated: true });
		} catch (err) {
			console.log("err", err);
			return res
				.status(500)
				.json({ revalidated: false, message: "Error revalidating" });
		}
	},
	["GET"]
);
