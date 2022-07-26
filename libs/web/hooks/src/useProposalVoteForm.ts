import { useCallback, useState } from "react";

import {
	fetchProposalStatus,
	getVoteAgainstReferendumExtrinsic,
	getVoteOnProposalExtrinsic,
	signAndSend,
} from "@app-gov/service/cennznet";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";

export interface ProposalVoteFormState {
	step: "Idle" | "Sign" | "Submit" | "Complete";
	status?: "Cancelled" | "Ok" | "NotOk";
	statusMessage?: string;
}

export const useProposalVoteForm = (proposalId: number) => {
	const { api } = useCENNZApi();
	const { wallet, selectedAccount } = useCENNZWallet();
	const [formState, setFormState] = useState<ProposalVoteFormState>({
		step: "Idle",
	});

	const setFormStep = (step: ProposalVoteFormState["step"]) => {
		setFormState({ step });
	};

	const setFormStatus = (
		status: ProposalVoteFormState["status"],
		statusMessage?: ProposalVoteFormState["statusMessage"]
	) => {
		setFormState((current) => ({ ...current, status, statusMessage }));
	};

	const onVote = useCallback(
		async (vote: boolean) => {
			if (!api || !wallet) return;
			setFormStep("Sign");
			try {
				const extrinsic = getVoteOnProposalExtrinsic(api, proposalId, vote);

				await signAndSend(
					[extrinsic, selectedAccount?.address, { signer: wallet.signer }],
					{
						onHashed() {
							setFormStep("Submit");
						},

						onCancelled() {
							setFormStatus("Cancelled");
						},
					}
				);
				const proposalStatus = await fetchProposalStatus(api, proposalId);
				setFormState({
					step: "Complete",
					status: "Ok",
					...(proposalStatus === "Disapproved" && {
						statusMessage:
							"This proposal has now been disapproved. You will be redirected to the proposal submission page.",
					}),
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.info(error);
				setFormStatus(
					"NotOk",
					`[${error?.code ?? "UNKNOWN"}] ${error?.message}`
				);
			}
		},
		[api, proposalId, selectedAccount, wallet]
	);
	const onVeto = useCallback(async () => {
		if (!api || !wallet) return;
		setFormStep("Sign");
		try {
			const extrinsic = getVoteAgainstReferendumExtrinsic(api, proposalId);
			await signAndSend(
				[extrinsic, selectedAccount?.address, { signer: wallet.signer }],
				{
					onHashed() {
						setFormStep("Submit");
					},

					onCancelled() {
						setFormStatus("Cancelled");
					},
				}
			);
			setFormState({
				step: "Complete",
				status: "Ok",
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.info(error);
			setFormStatus("NotOk", `[${error?.code ?? "UNKNOWN"}] ${error?.message}`);
		}
	}, [api, proposalId, selectedAccount, wallet]);

	return { formState, onVote, onVeto };
};
