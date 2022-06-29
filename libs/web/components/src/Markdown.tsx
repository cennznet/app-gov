import type { FC } from "react";

import RemarkGfm from "remark-gfm";
import RemarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
	input: string;
}

export const Markdown: FC<MarkdownProps> = ({ input }) => (
	<ReactMarkdown
		remarkPlugins={[[RemarkGfm, { singleTilde: false }], RemarkBreaks]}
	>
		{input}
	</ReactMarkdown>
);
