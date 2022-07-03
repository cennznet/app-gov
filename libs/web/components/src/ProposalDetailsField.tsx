import type { ChangeEventHandler, FC } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import { useControlledInput } from "@app-gov/web/hooks";
import { Button, Markdown, TextArea } from "@app-gov/web/components";

export const ProposalDetailsField: FC = () => {
	const [showPreview, setShowPreview] = useState<boolean>(false);

	const { value: proposalDetails, onChange: onProposalDetailsChange } =
		useControlledInput<string, HTMLTextAreaElement>("");

	return (
		<div className="w-full">
			<div
				className={classNames(
					"float-right inline-flex space-x-1",
					!showPreview && "mr-[1px]"
				)}
				role="group"
			>
				<Button
					size="small"
					onClick={() => setShowPreview(false)}
					active={!showPreview}
				>
					Write
				</Button>
				<Button
					size="small"
					onClick={() => setShowPreview(true)}
					active={showPreview}
				>
					Preview
				</Button>
			</div>
			<label htmlFor="proposalDetails" className="text-lg">
				Justification
			</label>
			<If condition={!showPreview}>
				<TextArea
					id="proposalDetails"
					name="proposalDetails"
					inputClassName="w-full"
					placeholder="|"
					value={proposalDetails}
					onChange={onProposalDetailsChange}
					required
				/>
			</If>
			<If condition={showPreview}>
				<div className="border-dark flex w-full border-[3px] bg-white px-4 py-2">
					<Markdown input={proposalDetails || "Nothing to preview"} />
				</div>
			</If>
		</div>
	);
};
