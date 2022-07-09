import { SubmittableResult } from "@cennznet/api";
import type {
	AddressOrPair,
	Signer,
	SignerOptions,
	SubmittableExtrinsic,
} from "@cennznet/api/types";
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

	(address
		? extrinsic.signAndSend(address, { signer: signer as Signer }, onResult)
		: extrinsic.signAndSend(signer as KeyringPair, onResult)
	).catch(onCatch);
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

interface StatusCallbacks {
	onHashed?: (hash: string) => void;
	onCancelled?: () => void;
	onInBlock?: (result: SubmittableResult) => void;
}

export const signAndSend = async (
	[extrinsic, ...args]: [SubmittableExtrinsic<"promise">, ...unknown[]],
	statusCallbacks?: StatusCallbacks
): Promise<SubmittableResult> => {
	return new Promise((resolve, reject) => {
		let hash: string;

		args.push((result: SubmittableResult) => {
			try {
				const { txHash, status, dispatchError } = result;
				// 1. Trigger `onHashed` if it's the first callback
				if (!hash) {
					statusCallbacks?.onHashed?.((hash = txHash.toString()));
				}

				if (!status.isInBlock && !status.isFinalized) return;

				if (status.isInBlock) statusCallbacks?.onInBlock?.(result);

				if (dispatchError && !dispatchError.isModule) {
					return reject({
						code: "CENNZ/UNKNOWN",
						message: dispatchError.toString(),
					});
				}

				if (dispatchError && dispatchError.isModule) {
					const { index, error } = dispatchError.asModule.toJSON();
					const decoded = dispatchError.registry.findMetaError(
						dispatchError.asModule
					);
					const { docs, name, section } = decoded;
					return reject({
						code: `CENNZ/I${index}E${error}`,
						message: `${section}.${name}: ${docs.join(" ")}`,
					});
				}

				if (status.isFinalized) return resolve(result);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				reject(error);
			}
		});

		extrinsic
			.signAndSend(...(args as [AddressOrPair, Partial<SignerOptions>?]))
			.catch((error) => {
				if (error?.message === "Cancelled")
					return statusCallbacks?.onCancelled?.();

				reject(error);
			});
	});
};
