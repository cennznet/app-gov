import { Api } from "@cennznet/api";
import { useCallback, useState } from "react";

import {
	getSubmitProposalExtrinsic,
	signAndSend,
} from "@app-gov/service/cennznet";
import { pinProposalData } from "@app-gov/service/pinata";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface ProposalFormState {
	step?: "Await" | "Submit" | "Process";
	status?: "Cancelled" | "Ok" | "NotOk";
	statusMessage?: string;
}

interface ProposalFormInputs {
	"justification": string;
	"enactmentDelay": string;
	"callSection": string;
	"callMethod": string;
	"callArgs[]": string;
	"sponsor": string;
}

type ProposalFormData = Map<
	keyof ProposalFormInputs,
	ProposalFormInputs[keyof ProposalFormInputs]
>;

interface PropsalData extends Record<string, unknown> {
	sponsor: string;
	enactmentDelay: number;
	justification: string;
	functionCall: [string, string, string, ...string[]];
}

export const useProposalNewForm = () => {
	const { api } = useCENNZApi();
	const { wallet } = useCENNZWallet();
	const [formState, setFormState] = useState<ProposalFormState>({});

	const setFormStep = (step: ProposalFormState["step"]) => {
		setFormState({ step });
	};

	const setFormStatus = (
		status: ProposalFormState["status"],
		statusMessage?: ProposalFormState["statusMessage"]
	) => {
		setFormState((current) => ({ ...current, status, statusMessage }));
	};

	const submitForm = useCallback(
		async (data: FormData) => {
			if (!api || !wallet) return;
			setFormStep("Await");

			try {
				const proposalData = transformFormData(
					api,
					data as unknown as ProposalFormData
				);

				const { hash, url } = await pinProposalData(proposalData);
				const { sponsor, functionCall, enactmentDelay } = proposalData;
				const extrinsic = getSubmitProposalExtrinsic(
					api,
					functionCall,
					url,
					enactmentDelay
				);

				await signAndSend([extrinsic, sponsor, { signer: wallet.signer }], {
					onHashed() {
						setFormStep("Submit");
					},

					onCancelled() {
						setFormStatus("Cancelled");
					},
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				setFormStatus(
					"NotOk",
					`[${error?.code ?? "UNKNOWN"}] ${error?.message}`
				);
			}
		},
		[api, wallet]
	);

	const resetFormState = useCallback(() => {
		setFormState({});
	}, []);

	return { submitForm, formState, resetFormState };
};

const transformFormData = (
	api: Api,
	formData: ProposalFormData
): PropsalData => {
	const blocksInHour =
		(60 * 60) / ((api.consts.babe.expectedBlockTime.toJSON() as number) / 1000);
	return Array.from(formData).reduce(
		(data, [key, value]) => {
			switch (key) {
				case "sponsor":
				case "justification":
					data[key] = value.toString();
					break;
				case "enactmentDelay":
					data.enactmentDelay = Number(value) * blocksInHour;
					break;

				case "callSection":
					data.functionCall[0] = value.toString();
					break;

				case "callMethod":
					data.functionCall[1] = value.toString();
					break;

				case "callArgs[]":
					data.functionCall.push(value as string);
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
