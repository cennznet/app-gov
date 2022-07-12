import { useCallback, useState } from "react";

import {
	getRequestJudgementExtrinsic,
	getSetIdentityExtrinsic,
	signAndSend,
} from "@app-gov/service/cennznet";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface IdentityFormState {
	step: "Idle" | "Await" | "Submit" | "Process" | "Success";
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

				await signAndSend([extrinsic, address, { signer: wallet.signer }], {
					onHashed() {
						setFormState({ step: "Submit" });
					},

					onCancelled() {
						setFormState(
							(current) =>
								({
									...current,
									status: "Cancelled",
								} as IdentityFormState)
						);
					},
				});

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
					if (result?.message === "DISCORD_USER_NOT_FOUND")
						return setFormState(
							(current) =>
								({
									...current,
									step: "Success",
									status: "Ok",
									statusMessage: result.message,
								} as IdentityFormState)
						);

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

				setFormState({ step: "Success", status: "Ok" });
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
