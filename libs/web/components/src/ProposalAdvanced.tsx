import type { ChangeEventHandler, FC } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import { AutoGrowInput, TextArea } from "@app-gov/web/components";
import { ChevronDown } from "@app-gov/web/vectors";

interface ProposalAdvancedProps {
	proposalExtrinsic: string;
	onProposalExtrinsicChange: ChangeEventHandler<
		HTMLTextAreaElement & HTMLInputElement
	>;
}

export const ProposalAdvanced: FC<ProposalAdvancedProps> = ({
	proposalExtrinsic,
	onProposalExtrinsicChange,
}) => {
	const [open, setOpen] = useState<boolean>(false);

	const [cennzModule, setCennzModule] = useState<string>("");
	const [cennzCall, setCennzCall] = useState<string>("");

	const { cennzValues, setCennzValue } = useCennzValues();

	return (
		<div className="w-full">
			<div
				className={classNames(
					"mt-6 inline-flex cursor-pointer items-center text-lg",
					open && "mb-4"
				)}
				onClick={() => setOpen(!open)}
			>
				Advanced{" "}
				<span className={classNames("duration-200", open && "rotate-180")}>
					<ChevronDown />
				</span>
			</div>
			<br />
			<If condition={open}>
				<label htmlFor="cennzExtrinsic" className="text-lg">
				Extrinsic
			</label>
			<fieldset
				id="cennzExtrinsic"
				className="border-dark mb-4 inline-flex w-full items-center border-[3px] bg-white px-4 py-2"
			>
				<p className="mr-2 tracking-widest text-gray-600">api.tx.</p>
				<AutoGrowInput
					placeholder="module"
					value={cennzModule}
					onChange={setCennzModule}
				/>
				<p className="mx-2 tracking-widest">.</p>
				<AutoGrowInput
					placeholder="call"
					value={cennzCall}
					onChange={setCennzCall}
				/>
			</fieldset>
			<label htmlFor="cennzValues" className="text-lg">
				Values
			</label>
			<fieldset
				id="cennzValues"
				className="border-dark inline-flex w-full items-center border-[3px] bg-white px-4 py-2"
			>
				{["one", "two", "three"].map((num, index) => (
					<AutoGrowInput
						placeholder={`value ${num}`}
						key={index}
						value={cennzValues[index]}
						onChange={(value: string) => setCennzValue(value, index)}
					/>
				))}
			</fieldset>
			</If>
		</div>
	);
};

const useCennzValues = () => {
	const [cennzValues, setCennzValues] = useState<Record<number, string>>({
		0: "",
		1: "",
		2: "",
	});

	const setCennzValue = (value: string, index: number) =>
		setCennzValues((prevValues) => ({
			...prevValues,
			[index]: value,
		}));

	return {
		cennzValues,
		setCennzValue,
	};
};