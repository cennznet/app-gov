import { useCallback, useState } from "react";

import {
	getRequestJudgementExtrinsic,
	getSetIdentityExtrinsic,
	signAndSendTx,
} from "@app-gov/service/cennznet";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface IdentityFormState {
	step: "Idle" | "Await" | "Submit" | "Process";
	status?: "Cancelled" | "Ok" | "NotOk";
	statusMessage?: string;
}

export const useIdentityConnectForm = () => {
	const { api } = useCENNZApi();
	const { wallet } = useCENNZWallet();

	const [formState, setFormState] = useState<IdentityFormState>({
		step: "Idle",
	});

	const submitForm = useCallback(
		async (data: FormData) => {
			if (!api || !wallet) return;
			setFormState({ step: "Await" });
			try {
				const {
					address,
					twitterUsername,
					discordUsername,
					twitterRegistrarIndex,
					discordRegistrarIndex,
				} = Object.fromEntries(data.entries());

				const extrinsic = api.tx.utility.batch([
					getSetIdentityExtrinsic(api, {
						discord: discordUsername as string,
						twitter: twitterUsername as string,
					}),

					getRequestJudgementExtrinsic(api, Number(twitterRegistrarIndex)),
					getRequestJudgementExtrinsic(api, Number(discordRegistrarIndex)),
				]);

				const tx = await signAndSendTx(
					extrinsic,
					wallet.signer,
					address as string
				);

				tx.on("txCancelled", () =>
					setFormState(
						(current) =>
							({
								...current,
								status: "Cancelled",
							} as IdentityFormState)
					)
				);

				tx.on("txHashed", () => {
					setFormState({ step: "Submit" });
				});

				tx.on("txFailed", (error) => {
					const { code = "Unknow", message = "" } = tx.decodeError(error);

					setFormState(
						(current) =>
							({
								...current,
								status: "NotOk",
								message: `[TX/${code}] ${message}`,
							} as IdentityFormState)
					);
				});

				tx.on("txSuccessful", async () => {
					setFormState({ step: "Process" });

					const response = await fetch("/api/identity/judgement", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(Object.fromEntries(data.entries())),
					});

					const result = await response.json();

					if (!response.ok) {
						return setFormState(
							(current) =>
								({
									...current,
									status: "NotOk",
									statusMessage: `[HTTP/${response.status}] ${
										result?.message ?? response?.statusText
									}`,
								} as IdentityFormState)
						);
					}

					setFormState(
						(current) => ({ ...current, status: "Ok" } as IdentityFormState)
					);
				});
			} catch (error: unknown) {
				console.info(error);
				setFormState(
					(current) =>
						({
							...current,
							status: "NotOk",
							message: (error as Error)?.message,
						} as IdentityFormState)
				);
			}
		},
		[api, wallet]
	);

	const resetFormState = useCallback(() => {
		setFormState({ step: "Idle" });
	}, []);

	return { submitForm, formState, resetFormState };
};
