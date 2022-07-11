import { FC, useEffect, useRef } from "react";
import { If } from "react-extras";

import { useControlledCheckbox, useControlledInput } from "@app-gov/web/hooks";
import { IntrinsicElements } from "@app-gov/web/types";

import {
	AccountSelect,
	Button,
	FunctionCallFieldSet,
	MarkdownField,
	Select,
} from "./";

interface ProposalNewFormProps {}

export const ProposalNewForm: FC<
	Omit<IntrinsicElements["form"], "parent"> & ProposalNewFormProps
> = (props) => {
	const copyInput = useControlledInput<string, HTMLTextAreaElement>("");
	const delayInput = useControlledInput<string, HTMLSelectElement>("24");
	const callToggle = useControlledCheckbox(false);
	const ref = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		ref.current?.focus();
	}, []);

	return (
		<form {...props}>
			<h2 className="font-display border-hero mb-4 border-b-2 text-2xl uppercase">
				Proposal Details
			</h2>

			<fieldset className="mb-6">
				<label className="mb-1 block text-lg font-bold" htmlFor="justification">
					Justification
				</label>
				<MarkdownField
					{...copyInput}
					required
					ref={ref}
					id="justification"
					name="justification"
				/>
			</fieldset>

			<fieldset className="mb-6">
				<label
					className="mb-1 block text-lg font-bold"
					htmlFor="enactmentDelay"
				>
					Enactment Delay
				</label>

				<Select
					className="w-1/2"
					{...delayInput}
					name="enactmentDelay"
					id="enactmentDelay"
				>
					<option value="24">24 hours</option>
					<option value="12">12 hours</option>
					<option value="6">6 hours</option>
					<option value="1">1 hour</option>
				</Select>
			</fieldset>

			<fieldset className="mb-6">
				<label
					htmlFor="proposalCallToggle"
					className="flex cursor-pointer items-center"
				>
					<input
						type="checkbox"
						className="mr-1 inline-block"
						id="proposalCallToggle"
						{...callToggle}
					/>
					This proposal require a function call
				</label>
			</fieldset>

			<If condition={callToggle.checked}>
				<h2 className="font-display border-hero mb-4 border-b-2 text-2xl uppercase">
					Function Call
				</h2>

				<fieldset className="mb-6 grid grid-cols-2 gap-4">
					<div className="cols-span-1">
						<label className="mb-1 block text-base font-bold">Section</label>
						<FunctionCallFieldSet.Section name="callSection" />
					</div>
					<div className="cols-span-2">
						<label className="mb-1 block text-base font-bold">Method</label>
						<FunctionCallFieldSet.Method name="callMethod" />
					</div>
					<div className="col-span-full">
						<label className="mb-1 block text-base font-bold">Arguments</label>
						<FunctionCallFieldSet.Args name="callArgs[]" />
					</div>
				</fieldset>
			</If>

			<h2 className="font-display border-hero mb-4 border-b-2 text-2xl uppercase">
				Signing Wallet
			</h2>

			<fieldset className="mb-6">
				<p className="prose mb-4">
					Ex consequat occaecat id nulla voluptate anim eu velit et laboris
					reprehenderit ut dolor magna ut minim voluptate labore non adipisicing
				</p>
				<AccountSelect required name="sponsor" />
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
	);
};
