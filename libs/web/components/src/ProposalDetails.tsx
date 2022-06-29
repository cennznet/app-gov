import type { ChangeEventHandler, FC } from "react";

import { useState } from "react";
import RemarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { classNames, If } from "react-extras";
import { Button, TextArea } from "@app-gov/web/components";

interface ProposalDetailsProps {
	proposalDetails: string;
	onProposalDetailsChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export const ProposalDetails: FC<ProposalDetailsProps> = ({
	proposalDetails,
	onProposalDetailsChange,
}) => {
	const [showPreview, setShowPreview] = useState<boolean>(false);

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
					value={proposalDetails}
					onChange={onProposalDetailsChange}
					required
				/>
			</If>
			<If condition={showPreview}>
				<div className="border-dark flex w-full border-[3px] bg-white px-4 py-2">
					<ReactMarkdown remarkPlugins={[[RemarkGfm, { singleTilde: false }]]}>
						{proposalDetails || "Nothing to preview"}
					</ReactMarkdown>
				</div>
			</If>
		</div>
	);
};
