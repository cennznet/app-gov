import { Api } from "@cennznet/api";
import { useCallback, useState } from "react";

import {
	getSubmitProposalExtrinsic,
	signAndSendTx,
} from "@app-gov/service/cennznet";
import { pinProposalData } from "@app-gov/service/pinata";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface ProposalFormState {
	key: number;
	step?: "Await" | "Submit" | "Process";
	status?: "Cancelled" | "Ok" | "NotOk";
	statusMessage?: string;
}

interface PropsalData extends Record<string, unknown> {
	sponsor: string;
	enactmentDelay: number;
	justification: string;
	functionCall: [string, string, string, ...string[]];
}

export const useProposalNewForm = () => {
	const { api } = useCENNZApi();
	const { wallet } = useCENNZWallet();
	const [formState, setFormState] = useState<ProposalFormState>({
		key: Date.now(),
	});

	const submitForm = useCallback(
		async (data: FormData) => {
			if (!api || !wallet) return;
			setFormState((current) => ({ ...current, step: "Await" }));

			try {
				const proposalData = processFormData(api, data);
				const { hash, url } = await pinProposalData(proposalData);
				const { sponsor, functionCall, enactmentDelay } = proposalData;
				const extrinsic = getSubmitProposalExtrinsic(
					api,
					functionCall,
					url,
					enactmentDelay
				);
				const tx = await signAndSendTx(extrinsic, wallet.signer, sponsor);

				tx.on("txCancelled", () =>
					setFormState((current) => ({
						...current,
						status: "Cancelled",
					}))
				);

				tx.on("txHashed", () => {
					setFormState((current) => ({ ...current, step: "Submit" }));
				});

				tx.on("txFailed", (error) => {
					const { code = "UNKNOWN", message = "" } = tx.decodeError(error);

					setFormState((current) => ({
						...current,
						status: "NotOk",
						message: `[CENNZ/${code}] ${message}`,
					}));
				});

				tx.on("txSuccessful", async (result) => {
					setFormState((current) => ({ ...current, step: "Process" }));
					const event = tx.findEvent(result, "governance", "submitProposal");
					console.log(event);

					setFormState(
						(current) => ({ ...current, status: "Ok" } as ProposalFormState)
					);
				});
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
		setFormState({ key: Date.now() });
	}, []);

	return { submitForm, formState, resetFormState };
};

const processFormData = (api: Api, formData: FormData): PropsalData => {
	const blocksInHour =
		(60 * 60) / ((api.consts.babe.expectedBlockTime.toJSON() as number) / 1000);
	return Array.from(formData).reduce(
		(data, [key, value]) => {
			switch (key) {
				case "address":
					data.sponsor = value.toString();
					break;
				case "enactmentDelayInHours":
					data.enactmentDelay = Number(value) * blocksInHour;
					break;

				case "functionSection":
					data.functionCall[0] = value.toString();
					break;

				case "functionMethod":
					data.functionCall[1] = value.toString();
					break;

				case "functionArgs[]":
					data.functionCall.push(value as string);
					break;

				case "justification":
					data.justification = value.toString();
					break;
			}

			return data;
		},
		{
			sponsor: undefined,
			enactmentDelay: undefined,
			justification: undefined,
			functionCall: [undefined, undefined],
		} as unknown as PropsalData
	);
};
