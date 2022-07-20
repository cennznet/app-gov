import { withMethodGuard } from "@app-gov/node/utils";
import { findProposalId, getApiInstance } from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/env-vars";

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

		// TODO: Wait for the relayer to create the proposal then return
		// or if it takes longer than 10 seconds, return regardless

		return res.json({ ok: true });
	},
	["POST"]
);
