import { Api } from "@cennznet/api";
import { useCallback, useState } from "react";

import {
	findProposalId,
	getSubmitProposalExtrinsic,
	signAndSend,
} from "@app-gov/service/cennznet";
import {
	pinProposalData,
	updateProposalPinName,
} from "@app-gov/service/pinata";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface ProposalNewFormState {
	step: "Idle" | "Await" | "Submit" | "Process" | "Success";
	status?: "Cancelled" | "Ok" | "NotOk";
	statusMessage?: string;
}

interface ProposalNewFormInputs {
	"justification": string;
	"enactmentDelay": string;
	"callSection": string;
	"callMethod": string;
	"callArgs[]": string;
	"sponsor": string;
}

type ProposalFormData = Map<
	keyof ProposalNewFormInputs,
	ProposalNewFormInputs[keyof ProposalNewFormInputs]
>;

interface PropsalData extends Record<string, unknown> {
	sponsor: string;
	enactmentDelay: number;
	justification: string;
	functionCall: [string, string, string, ...string[]];
	createdAt: number;
}

export const useProposalNewForm = () => {
	const { api } = useCENNZApi();
	const { wallet } = useCENNZWallet();
	const [formState, setFormState] = useState<ProposalNewFormState>({
		step: "Idle",
	});

	const setFormStep = (step: ProposalNewFormState["step"]) => {
		setFormState({ step });
	};

	const setFormStatus = (
		status: ProposalNewFormState["status"],
		statusMessage?: ProposalNewFormState["statusMessage"]
	) => {
		setFormState((current) => ({ ...current, status, statusMessage }));
	};

	const submitForm = useCallback(
		async (data: FormData) => {
			if (!api || !wallet) return;
			setFormStep("Await");

			const proposalData = transformFormData(
				api,
				data as unknown as ProposalFormData
			);
			const { sponsor, functionCall, enactmentDelay } = proposalData;

			try {
				// 1. Pin the proposalData to Pinata as IPFS JSON
				const { pinHash, pinUrl } = await pinProposalData(proposalData);

				// 2. Send governance.submitProposal extrinsinc
				const extrinsic = getSubmitProposalExtrinsic(
					api,
					pinUrl,
					enactmentDelay,
					functionCall.length
						? functionCall
						: ["system", "remark", `Proposal enacted`]
				);
				await signAndSend([extrinsic, sponsor, { signer: wallet.signer }], {
					onHashed() {
						setFormStep("Submit");
					},

					onCancelled() {
						setFormStatus("Cancelled");
					},
				});

				// 3. Update the pin name with proper `proposalId`
				const proposalId = await findProposalId(api, {
					sponsor,
					justificationUri: pinUrl,
				});

				if (!proposalId)
					throw {
						code: "APP/NOT_FOUND",
						message: "Recently created proposal id is `undefined`",
					};
				await updateProposalPinName(pinHash, proposalId);

				// 4. Post a request to API to process the proposal data
				setFormStep("Process");
				const response = await fetch("/api/proposal/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						sponsor,
						proposalId,
						justificationUri: pinUrl,
					}),
				});

				if (!response.ok) {
					throw {
						code: `APP/${response.status}`,
						message: response.statusText,
						details: await response.text(),
					};
				}

				setFormStatus("Ok");

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.info(error);
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
			functionCall: [],
			createdAt: Date.now(),
		} as unknown as PropsalData
	);
};
