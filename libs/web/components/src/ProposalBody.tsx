import { FC } from "react";

import { IntrinsicElements } from "@app-gov/web/utils";

import { Markdown } from "./";

interface JustificationProps {
	justification: string;
}

const Justification: FC<JustificationProps & IntrinsicElements["div"]> = ({
	justification,
	...props
}) => {
	return (
		<div {...props}>
			<h2 className="font-display border-hero mb-4 border-b-2 text-3xl uppercase">
				Justification
			</h2>
			<Markdown className="prose max-w-none">{justification}</Markdown>
		</div>
	);
};

interface CallProps {
	call: Record<string, unknown>;
}

const Call: FC<CallProps & IntrinsicElements["div"]> = ({ call, ...props }) => {
	return (
		<div {...props}>
			<h2 className="font-display border-hero mb-4 border-b-2 text-3xl uppercase">
				Function Call
			</h2>

			<Markdown>{`
\`\`\`
${JSON.stringify(call, null, "\t")}
\`\`\`
`}</Markdown>
		</div>
	);
};

export const ProposalBody = {
	Justification,
	Call,
};
