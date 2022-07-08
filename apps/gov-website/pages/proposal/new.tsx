import type { GetStaticProps, NextPage } from "next";
import { FormEventHandler, useCallback, useEffect } from "react";
import { If } from "react-extras";

import {
	extractCallableExtrinsics,
	getApiInstance,
} from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	AccountSelect,
	Button,
	FunctionCallFieldSet,
	Header,
	Layout,
	MarkdownField,
	Select,
	useTransactionDialog,
} from "@app-gov/web/components";
import {
	useControlledCheckbox,
	useControlledInput,
	useProposalNewForm,
} from "@app-gov/web/hooks";

interface StaticProps {
	extrinsics: Awaited<ReturnType<typeof extractCallableExtrinsics>>;
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);
	const extrinsics = await extractCallableExtrinsics(api);

	return {
		props: {
			extrinsics,
		},
	};
};

const NewProposal: NextPage<StaticProps> = ({ extrinsics }) => {
	const {
		value: justification,
		onChange: onJustificationChange,
		resetValue: resetJustificationValue,
	} = useControlledInput<string, HTMLTextAreaElement>("");

	const {
		value: functionCall,
		onChange: onFunctionCallChange,
		resetValue: resetFunctionCallValue,
	} = useControlledCheckbox(true);

	const { submitForm, formState, resetFormState } = useProposalNewForm();
	const { open, openDialog, closeDialog } = useTransactionDialog();

	console.log(formState);

	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
			openDialog();
			submitForm(new FormData(event.target as HTMLFormElement));
		},
		[openDialog, submitForm]
	);

	const onDismissClick = useCallback(() => {
		closeDialog();
		setTimeout(() => {
			resetFormState();
		}, 200);
	}, [closeDialog, resetFormState]);

	useEffect(() => {
		window["onDismissClick"] = onDismissClick;
	}, [onDismissClick]);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display text-hero mb-8 text-center text-7xl uppercase">
					Submit a Proposal
				</h1>

				<p className="mb-8 text-lg">
					To submit a proposal you must be a CENNZnet Councillor. Lorem laborum
					dolor minim mollit eu reprehenderit culpa dolore labore dolor mollit
					commodo do anim incididunt sunt id pariatur elit tempor nostrud nulla
					eu proident ut id qui incididunt.
				</p>
				<form onSubmit={onFormSubmit} key={formState.key}>
					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Proposal Details
					</h2>

					<fieldset className="mb-6">
						<label
							className="mb-1 block text-lg font-bold"
							htmlFor="justification"
						>
							Justification
						</label>
						<MarkdownField
							required
							id="justification"
							name="justification"
							value={justification}
							onChange={onJustificationChange}
						/>
					</fieldset>

					<fieldset className="mb-6">
						<label
							className="mb-1 block text-lg font-bold"
							htmlFor="enactmentDelayInHours"
						>
							Enactment Delay
						</label>
						<Select
							className="w-1/2"
							id="enactmentDelayInHours"
							name="enactmentDelayInHours"
						>
							<option value={24}>24 hours</option>
							<option value={12}>12 hours</option>
							<option value={6}>6 hours</option>
							<option value={1}>1 hour</option>
						</Select>
					</fieldset>

					<fieldset className="mb-6">
						<label
							htmlFor="functionCall"
							className="flex cursor-pointer items-center"
						>
							<input
								type="checkbox"
								checked={functionCall}
								onChange={onFunctionCallChange}
								className="mr-1 inline-block"
								id="functionCall"
							/>
							This proposal require a function call
						</label>
					</fieldset>

					<If condition={functionCall}>
						<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
							Function Call
						</h2>

						<fieldset className="mb-6 grid grid-cols-2 gap-4">
							<FunctionCallFieldSet.Provider extrinsics={extrinsics}>
								<div className="cols-span-1">
									<label className="mb-1 block text-lg font-bold">
										Section
									</label>
									<FunctionCallFieldSet.Section name="functionSection" />
								</div>
								<div className="cols-span-2">
									<label className="mb-1 block text-lg font-bold">Method</label>
									<FunctionCallFieldSet.Method name="functionMethod" />
								</div>
								<div className="col-span-full">
									<label className="mb-1 block text-lg font-bold">
										Arguments
									</label>
									<FunctionCallFieldSet.Args name="functionArgs[]" />
								</div>
							</FunctionCallFieldSet.Provider>
						</fieldset>
					</If>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Signing Wallet
					</h2>

					<fieldset className="mb-6">
						<p className="mb-4">
							Ex consequat occaecat id nulla voluptate anim eu velit et laboris
							reprehenderit ut dolor magna ut minim voluptate labore non
							adipisicing
						</p>
						<AccountSelect required name="address" />
					</fieldset>

					<fieldset className="mt-16 text-center">
						<Button type="submit" className="w-1/3 text-center">
							<div className="flex items-center justify-center">
								<span>Sign and Submit</span>
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
