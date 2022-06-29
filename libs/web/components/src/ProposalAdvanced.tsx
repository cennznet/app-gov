import type { ChangeEventHandler, FC } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import { TextArea } from "@app-gov/web/components";
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
				<label htmlFor="proposalExtrinsic" className="text-lg">
					Extrinsic Code
				</label>
				<TextArea
					id="proposalExtrinsic"
					name="proposalExtrinsic"
					inputClassName="w-full"
					value={proposalExtrinsic}
					onChange={onProposalExtrinsicChange}
					rows={3}
				/>
			</If>
		</div>
	);
};
