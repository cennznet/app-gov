import { SubmittableResult } from "@cennznet/api";
import type {
	AddressOrPair,
	SignerOptions,
	SubmittableExtrinsic,
} from "@cennznet/api/types";

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

				if (status.isInBlock) return statusCallbacks?.onInBlock?.(result);
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
