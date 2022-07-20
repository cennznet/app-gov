import { Api } from "@cennznet/api";
import { VoidFn } from "@cennznet/api/types";
import { Header } from "@polkadot/types/interfaces";

export const subscribeFinalizedHeads = async (
	api: Api,
	pollingInterval: number,
	callback: (blockNumber: number) => void
): Promise<VoidFn> => {
	let lastBlockPolled: number;
	return api.rpc.chain.subscribeFinalizedHeads((header: Header) => {
		const blockNumber = header.number.toNumber();
		if (lastBlockPolled && blockNumber < lastBlockPolled + pollingInterval)
			return;
		lastBlockPolled = blockNumber;
		callback(blockNumber);
	});
};
