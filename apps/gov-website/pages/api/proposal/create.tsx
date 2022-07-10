import { withMethodGuard } from "@app-gov/node/utils";
import { findProposalId, getApiInstance } from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/constants";

export default withMethodGuard(
	async function proposalCreateRoute(req, res) {
		const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);
		const { sponsor, proposalId, justificationUri } = req.body;
		const onChainProposalId = await findProposalId(api, {
			sponsor,
			justificationUri,
		});

		if (proposalId !== onChainProposalId)
			return res.status(400).end(`Proposal ID is invalid`);

		// TODO: Create an instance of database here

		return res.json({ ok: true });
	},
	["POST"]
);
