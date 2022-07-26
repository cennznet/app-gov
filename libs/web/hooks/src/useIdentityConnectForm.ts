import { useCallback, useState } from "react";

import { HttpError, safeFetch } from "@app-gov/node/utils";
import {
	getRequestJudgementExtrinsic,
	getSetIdentityExtrinsic,
	signAndSend,
} from "@app-gov/service/cennznet";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface IdentityFormState {
	step: "Idle" | "Sign" | "Submit" | "Process" | "Complete";
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
			setFormStep("Sign");

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

				await safeFetch("/api/identity/judgement", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(Object.fromEntries(data.entries())),
				});

				setFormState({ step: "Complete", status: "Ok" });

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.info(error);

				if (error instanceof HttpError) {
					const responseText = await error.response.text();
					if (!responseText.includes("Discord"))
						return setFormStatus("NotOk", `[${error.code}] ${error.message}`);
					return setFormState({
						step: "Complete",
						status: "Ok",
						statusMessage: JSON.parse(responseText)?.message,
					});
				}

				setFormStatus(
					"NotOk",
					`[${error?.code ?? "UNKNOWN"}] ${error.message}`
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
