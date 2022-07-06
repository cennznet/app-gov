import { ComponentProps, FC } from "react";
import { classNames } from "react-extras";
import ReactMarkdown from "react-markdown";
import RemarkBreaks from "remark-breaks";
import RemarkGfm from "remark-gfm";

export const Markdown: FC<ComponentProps<typeof ReactMarkdown>> = ({
	className,
	...props
}) => {
	return (
		<ReactMarkdown
			{...props}
			className={classNames(className, "markdown")}
			allowedElements={["p", "strong", "em", "a", "code", "pre"]}
			remarkPlugins={[[RemarkGfm, { singleTilde: false }], RemarkBreaks]}
		/>
	);
};
