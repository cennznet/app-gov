import { Api } from "@cennznet/api";

export async function waitForBlock(
	api: Api,
	numberOfBlocks: number
): Promise<void> {
	let firstBlock: number;
	let unsubscribeFn: () => void;
	return new Promise((resolve) => {
		api.derive.chain
			.subscribeNewHeads((header) => {
				const headerBlock = header.number.toNumber();
				if (!firstBlock) firstBlock = header.number.toNumber();
				if (headerBlock < firstBlock + numberOfBlocks) return;
				unsubscribeFn?.();
				resolve();
			})
			.then((unsubscribe) => {
				unsubscribeFn = unsubscribe;
			});
	});
}
