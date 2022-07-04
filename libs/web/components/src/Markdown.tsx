import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import RemarkBreaks from "remark-breaks";
import RemarkGfm from "remark-gfm";

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
