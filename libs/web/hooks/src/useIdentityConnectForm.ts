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

	const setFormStep = (step: IdentityFormState["step"]) => {
		setFormState({ step });
	};

	const setFormStatus = (
		status: IdentityFormState["status"],
		statusMessage?: IdentityFormState["statusMessage"]
	) => {
		setFormState((current) => ({ ...current, status, statusMessage }));
	};

	const submitForm = useCallback(
		async (data: FormData) => {
			if (!api || !wallet) return;
			setFormStep("Await");

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
						setFormStep("Submit");
					},

					onCancelled() {
						setFormStatus("Cancelled");
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

				if (!response.ok) {
					throw {
						code: `APP/${response.status}`,
						message: response.statusText,
						details: JSON.parse(await response.text()).message,
					};
				}

				setFormState({ step: "Success", status: "Ok" });

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.info(error);

				if (error?.details?.includes("DISCORD"))
					return setFormState({
						step: "Success",
						status: "Ok",
						statusMessage: error.details,
					});

				setFormStatus(
					"NotOk",
					`[${error?.code ?? "UNKNOWN"}] ${error?.message}`
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
