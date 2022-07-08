import { useCallback, useState } from "react";

import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface ProposalFormState {
	step: "Await" | "Submit";
	status?: "Cancelled" | "Ok" | "NotOk";
	statusMessage?: string;
}

export const useProposalNewForm = () => {
	const { api } = useCENNZApi();
	const { wallet } = useCENNZWallet();
	const [formState, setFormState] = useState<ProposalFormState>();

	const submitForm = useCallback(
		async (data: FormData) => {
			if (!api || !wallet) return;
			setFormState({ step: "Await" });

			try {
			} catch (error) {
				console.info(error);
				setFormState(
					(current) =>
						({
							...current,
							status: "NotOk",
							message: (error as Error)?.message,
						} as ProposalFormState)
				);
			}
		},
		[api, wallet]
	);

	const resetFormState = useCallback(() => {
		setFormState(undefined);
	}, []);

	return { submitForm, formState, resetFormState };
};
