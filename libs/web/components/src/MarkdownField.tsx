/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useCallback, useState } from "react";
import { classNames } from "react-extras";
import ReactMarkdown from "react-markdown";
import RemarkBreaks from "remark-breaks";
import RemarkGfm from "remark-gfm";

import { IntrinsicElements } from "@app-gov/web/types";

interface MarkdownFieldProps {}

export const MarkdownField: FC<
	IntrinsicElements["textarea"] & MarkdownFieldProps
> = ({ className, children, value, rows = 10, ...props }) => {
	const [preview, setPreview] = useState<boolean>(false);
	const onWriteClick = useCallback(() => {
		setPreview(false);
	}, []);

	const onPreviewClick = useCallback(() => {
		setPreview(true);
	}, []);

	return (
		<div
			className={classNames(
				className,
				"border-hero flex min-h-[400px] w-full  flex-col border-2 bg-white"
			)}
		>
			<div className="flex border-b border-b-slate-200 bg-white p-2 text-slate-600">
				<span
					onClick={onWriteClick}
					className={classNames(
						"hover:text-hero cursor-pointer",
						!preview && "text-hero"
					)}
				>
					Write
				</span>
				<span className="mx-2">|</span>
				<span
					onClick={onPreviewClick}
					className={classNames(
						"hover:text-hero cursor-pointer",
						preview && "text-hero"
					)}
				>
					Preview
				</span>
			</div>

			<div className="relative flex-1">
				<textarea
					{...props}
					value={value}
					rows={rows}
					className="absolute inset-0 resize-none p-2 font-mono text-sm outline-none"
				/>

				<div
					className={classNames(
						"absolute inset-0 overflow-scroll bg-white",
						!preview && "pointer-events-none opacity-0",
						preview && "!pointer-events-auto !opacity-100"
					)}
				>
					<ReactMarkdown
						allowedElements={["p", "strong", "em", "a", "code", "pre"]}
						remarkPlugins={[[RemarkGfm, { singleTilde: false }], RemarkBreaks]}
						className="markdown h-full overflow-auto p-2"
					>
						{(value as string) ?? ""}
					</ReactMarkdown>
				</div>
			</div>
			<p className="markdown bg-slate-100 p-2 text-xs">
				Supported markdown: <strong>**bold**</strong>, <em>*italic*</em>,{" "}
				<a href="#">[link]()</a>, <code className="!text-xs">`code`</code> and{" "}
				<span className="mb-4 inline whitespace-pre-wrap bg-slate-50">
					<code className="!p-0 !text-xs !text-inherit">
						```multiline code```
					</code>
				</span>
			</p>
		</div>
	);
};
