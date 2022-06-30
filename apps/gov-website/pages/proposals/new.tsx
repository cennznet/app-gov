import type { NextPage } from "next";
import type { SubmittableResult } from "@cennznet/api";

import { If } from "react-extras";
import {
	Button,
	Header,
	Layout,
	ProposalAdvanced,
	ProposalDetailsField,
	TextField,
	WalletSelect,
} from "@app-gov/web/components";
import { Spinner } from "@app-gov/web/vectors";
import { PINATA_GATEWAY } from "@app-gov/service/constants";
import { FormEventHandler, useCallback, useMemo, useState } from "react";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";
import { useControlledInput } from "@app-gov/web/hooks";
import { pinProposal } from "@app-gov/service/pinata";
import { SubmittableExtrinsic } from "@cennznet/api/types";

const NewProposal: NextPage = () => {
	const { value: proposalTitle, onChange: onProposalTitleChange } =
		useControlledInput<string, HTMLInputElement>("");
	const { value: proposalDetails, onChange: onProposalDetailsChange } =
		useControlledInput<string, HTMLTextAreaElement>("");
	const { value: proposalDelay, onChange: onProposalDelayChange } =
		useControlledInput<number, HTMLInputElement>(0);

	const [cennzModule, setCennzModule] = useState<string>("");
	const [cennzCall, setCennzCall] = useState<string>("");
	const { cennzValues, setCennzValue } = useCennzValues();

	const { api } = useCENNZApi();

	const proposalExtrinsic = useMemo<
		SubmittableExtrinsic<"promise"> | undefined
	>(() => {
		if (!api || !cennzModule || !cennzCall) return undefined;

		try {
			return api.tx[cennzModule][cennzCall](...Object.values(cennzValues));
		} catch (_) {
			return undefined;
		}
	}, [cennzModule, cennzCall, cennzValues, api]);

	const { busy, onFormSubmit } = useFormSubmit(proposalExtrinsic);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<form onSubmit={onFormSubmit}>
					<h1 className="font-display mb-8 text-center text-7xl uppercase">
						Submit a Proposal
					</h1>

					<p className="mb-8 text-lg">
						To submit a proposal you must be a CENNZnet Councillor. Lorem
						laborum dolor minim mollit eu reprehenderit culpa dolore labore
						dolor mollit commodo do anim incididunt sunt id pariatur elit tempor
						nostrud nulla eu proident ut id qui incididunt.
					</p>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your wallet
					</h2>
					<p className="mb-8">
						Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
						labore dolor mollit commodo do anim incididunt sunt id pariatur elit
						tempor nostrud nulla eu proident ut id qui incididunt.
					</p>
					<fieldset className="mb-12 min-w-0">
						<WalletSelect required />
					</fieldset>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Enter proposal details
					</h2>
					<p className="mb-8">
						The <em>justification</em> section supports markdown! Refer to{" "}
						<a
							href="https://assets.discohook.app/discord_md_cheatsheet.pdf"
							target="_blank"
							rel="noreferrer"
							className="border-hero border-b italic"
						>
							this cheatsheet
						</a>{" "}
						to take advantage.
					</p>

					<fieldset className="space-y-6">
						<div>
							<label htmlFor="proposalTitle" className="text-lg">
								Title
							</label>
							<TextField
								id="proposalTitle"
								name="proposalTitle"
								inputClassName="w-full"
								value={proposalTitle}
								onChange={onProposalTitleChange}
								required
							/>
						</div>

						<ProposalDetailsField
							proposalDetails={proposalDetails}
							onProposalDetailsChange={onProposalDetailsChange}
						/>

						<div>
							<label htmlFor="proposalDelay" className="text-lg">
								Enactment Delay <span className="text-base">(# blocks)</span>
							</label>
							<TextField
								id="proposalDelay"
								name="proposalDelay"
								type="number"
								placeholder={"0"}
								inputClassName="w-full"
								value={proposalDelay}
								onChange={onProposalDelayChange}
								required
							/>
						</div>
					</fieldset>

					<ProposalAdvanced
						cennzModule={cennzModule}
						setCennzModule={setCennzModule}
						cennzCall={cennzCall}
						setCennzCall={setCennzCall}
						cennzValues={cennzValues}
						setCennzValue={setCennzValue}
					/>

					<fieldset className="mt-16 text-center">
						<Button type="submit" className="w-1/3 text-center" disabled={busy}>
							<div className="flex items-center justify-center">
								<If condition={busy}>
									<span className="mr-2">
										<Spinner />
									</span>
								</If>
								<span>{busy ? "Processing..." : "Sign and Submit"}</span>
							</div>
						</Button>
						<p className="mt-2 text-sm">Estimated gas fee 2 CPAY</p>
					</fieldset>
				</form>
			</div>
		</Layout>
	);
};

export default NewProposal;

const useCennzValues = () => {
	const [cennzValues, setCennzValues] = useState<Record<string, string>>();

	const setCennzValue = (arg: string, value: string) =>
		setCennzValues((prevValues) => ({
			...prevValues,
			[arg]: value,
		}));

	return {
		cennzValues,
		setCennzValue,
	};
};

const useFormSubmit = (
	proposalExtrinsic: SubmittableExtrinsic<"promise"> | undefined
) => {
	const [busy, setBusy] = useState<boolean>(false);

	const { api } = useCENNZApi();
	const { selectedAccount, wallet } = useCENNZWallet();
	const signer = wallet?.signer;

	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		async (event) => {
			event.preventDefault();

			if (!api || !selectedAccount || !signer) return;
			setBusy(true);

			try {
				const proposalData = new FormData(event.target as HTMLFormElement);

				const { IpfsHash } = await pinProposal({
					proposalTitle: proposalData.get("proposalTitle").toString(),
					proposalDetails: proposalData.get("proposalDetails").toString(),
				});

				await api.tx.governance
					.submitProposal(
						proposalExtrinsic,
						PINATA_GATEWAY.concat(IpfsHash),
						proposalData.get("proposalDelay")
					)
					.signAndSend(
						selectedAccount.address,
						{ signer },
						(result: SubmittableResult) => {
							const { txHash } = result;
							console.info("Transaction", txHash.toString());
						}
					);
			} catch (error) {
				console.log("error", error.message);
			}

			setBusy(false);
		},
		[api, selectedAccount, signer]
	);

	return { busy, onFormSubmit };
};
