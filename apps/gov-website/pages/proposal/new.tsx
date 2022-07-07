import type { GetStaticProps, NextPage } from "next";
import { FormEventHandler, useCallback } from "react";
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
} from "@app-gov/web/components";
import { useControlledCheckbox, useControlledInput } from "@app-gov/web/hooks";

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
	const { value: justification, onChange: onJustificationChange } =
		useControlledInput<string, HTMLTextAreaElement>("");

	const { value: functionCall, onChange: onFunctionCallChange } =
		useControlledCheckbox(true);

	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
		},
		[]
	);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<form onSubmit={onFormSubmit}>
					<h1 className="font-display text-hero mb-8 text-center text-7xl uppercase">
						Submit a Proposal
					</h1>

					<p className="mb-8 text-lg">
						To submit a proposal you must be a CENNZnet Councillor. Lorem
						laborum dolor minim mollit eu reprehenderit culpa dolore labore
						dolor mollit commodo do anim incididunt sunt id pariatur elit tempor
						nostrud nulla eu proident ut id qui incididunt.
					</p>

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
							value={justification}
							onChange={onJustificationChange}
						/>
					</fieldset>

					<fieldset className="mb-6">
						<label
							className="mb-1 block text-lg font-bold"
							htmlFor="enacmentDelay"
						>
							Enactment Delay
						</label>
						<Select className="w-1/2" id="enacmentDelay">
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
									<FunctionCallFieldSet.Section />
								</div>
								<div className="cols-span-2">
									<label className="mb-1 block text-lg font-bold">Method</label>
									<FunctionCallFieldSet.Method />
								</div>
								<div className="col-span-full">
									<label className="mb-1 block text-lg font-bold">
										Arguments
									</label>
									<FunctionCallFieldSet.Args />
								</div>
							</FunctionCallFieldSet.Provider>
						</fieldset>
					</If>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Sign and Submit
					</h2>

					<fieldset className="mb-6">
						<label
							className="mb-1 block text-lg font-bold"
							htmlFor="enacmentDelay"
						>
							Signing Account
						</label>
						<AccountSelect required name="address" />
					</fieldset>

					<fieldset className="mt-16 text-center">
						<Button type="submit" className="w-1/3 text-center">
							<div className="flex items-center justify-center">
								<span>Proceed</span>
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
