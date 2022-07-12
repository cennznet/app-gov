/* eslint-disable jsx-a11y/anchor-is-valid */
import { forwardRef, useCallback, useMemo, useState } from "react";
import { classNames } from "react-extras";

import { IntrinsicElements } from "@app-gov/web/types";

import { Markdown } from "./";

interface MarkdownFieldProps {}

export const MarkdownField = forwardRef<
	HTMLTextAreaElement,
	IntrinsicElements["textarea"] & MarkdownFieldProps
>(({ className, children, value, rows = 10, ...props }, ref) => {
	const [preview, setPreview] = useState<boolean>(false);

	const characterCount = useMemo(() => (value as string)?.length, [value]);

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
					ref={ref}
					value={value}
					rows={rows}
					maxLength={1024}
					className="absolute inset-0 resize-none p-2 font-mono text-sm outline-none"
				/>

				<div
					className={classNames(
						"absolute inset-0 overflow-scroll bg-white",
						!preview && "pointer-events-none opacity-0",
						preview && "!pointer-events-auto !opacity-100"
					)}
				>
					<Markdown className="overflow-auto p-2">
						{(value as string) ?? ""}
					</Markdown>
				</div>
			</div>
			<span className="flex bg-slate-100 p-2 text-xs">
				<p className="markdown flex-1">
					Supported markdown: <strong>**bold**</strong>, <em>*italic*</em>,{" "}
					<a href="#">[link]()</a>, <code className="!text-xs">`code`</code> and{" "}
					<span className="mb-4 inline whitespace-pre-wrap bg-slate-50">
						<code className="!p-0 !text-xs !text-inherit">
							```multiline code```
						</code>
					</span>
				</p>
				<p className={classNames(characterCount === 1024 && "text-red-600")}>
					{characterCount} / 1024
				</p>
			</span>
		</div>
	);
});
