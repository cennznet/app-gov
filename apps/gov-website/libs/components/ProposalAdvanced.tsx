import type { ChangeEventHandler, FC } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import { TextField } from "@gov-app/libs/components";
import { NULL_ADDRESS } from "@gov-app/libs/constants";
import { ChevronDown } from "@app-gov/ui/vectors";

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
					Extrinsic Hash
				</label>
				<TextField
					id="proposalExtrinsic"
					name="proposalExtrinsic"
					inputClassName="w-full"
					placeholder={NULL_ADDRESS}
					value={proposalExtrinsic}
					onChange={onProposalExtrinsicChange}
					multiline
				/>
			</If>
		</div>
	);
};
