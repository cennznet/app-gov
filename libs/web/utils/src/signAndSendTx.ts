import type { SubmittableResult } from "@cennznet/api";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CENNZTransaction } from "@app-gov/web/utils";
import { Signer, SubmittableExtrinsic } from "@cennznet/api/types";

export const signAndSendTx = async (
	extrinsic: SubmittableExtrinsic<"promise">,
	address: string,
	signer: Signer
): Promise<CENNZTransaction> => {
	const tx = new CENNZTransaction();

	extrinsic
		.signAndSend(address, { signer }, (result: SubmittableResult) => {
			const { txHash } = result;
			console.info("Transaction", txHash.toString());
			tx.setHash(txHash.toString());
			tx.setResult(result);
		})
		.catch((error) => {
			if (error?.message !== "Cancelled") throw error;
			tx.setCancel();
		});

	return tx;
};
