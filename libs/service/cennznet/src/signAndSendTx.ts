import { SubmittableResult } from "@cennznet/api";
import type { Signer, SubmittableExtrinsic } from "@cennznet/api/types";
import { KeyringPair } from "@polkadot/keyring/types";

import { Transaction } from "./Transaction";

export const signAndSendTx = async (
	extrinsic: SubmittableExtrinsic<"promise">,
	signer: KeyringPair | Signer,
	address?: string
): Promise<Transaction> => {
	const tx = new Transaction();
	const onResult = (result: SubmittableResult) => {
		const { txHash } = result;
		tx.setHash(txHash.toString());
		tx.setResult(result);
	};

	const onCatch = (error: Error) => {
		if (error?.message === "Cancelled") return tx.setCancel();
		return Promise.reject(error);
	};

	if (address) {
		await extrinsic
			.signAndSend(address, { signer: signer as Signer }, onResult)
			.catch(onCatch);

		return tx;
	}

	await extrinsic.signAndSend(signer as KeyringPair, onResult).catch(onCatch);
	return tx;
};

export const signAndSendPromise = async (
	extrinsic: SubmittableExtrinsic<"promise">,
	signer: KeyringPair | Signer,
	address?: string
): Promise<SubmittableResult> => {
	return new Promise((resolve, reject) => {
		signAndSendTx(extrinsic, signer, address)
			.then((tx) => {
				tx.on("txFailed", (error) => {
					reject(tx.decodeError(error));
				});

				tx.on("txSuccessful", (result) => {
					resolve(result);
				});
			})
			.catch(reject);
	});
};
