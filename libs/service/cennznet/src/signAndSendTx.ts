import { Transaction } from "@app-gov/service/cennznet";
import { SubmittableResult } from "@cennznet/api";
import type { Signer, SubmittableExtrinsic } from "@cennznet/api/types";
import type { ISubmittableResult } from "@cennznet/types";

export async function signAndSendTx(
	extrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>,
	address: string,
	signer: Signer
): Promise<Transaction> {
	const tx = new Transaction();

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
}
