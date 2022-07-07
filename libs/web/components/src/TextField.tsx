import { FC, ReactNode } from "react";
import { classNames, If } from "react-extras";

import type { IntrinsicElements, PropsWithChildren } from "@app-gov/web/types";

interface TextFieldProps extends PropsWithChildren {
	startAdornment?: ReactNode;
	endAdornment?: ReactNode;
	inputClassName?: string;
}

export const TextField: FC<IntrinsicElements["input"] & TextFieldProps> = ({
	type = "text",
	startAdornment,
	endAdornment,
	className,
	inputClassName,
	children,
	...props
}) => {
	return (
		<div
			className={classNames(
				className,
				"border-hero flex w-full items-center justify-between border-2 bg-white"
			)}
		>
			<If condition={!!startAdornment}>
				<span className="flex-shrink-0 px-2">{startAdornment}</span>
			</If>
			<input
				{...props}
				type={type}
				className={classNames(
					inputClassName,
					"min-w-0 flex-1 flex-shrink px-2 py-2 outline-none"
				)}
			/>
			<If condition={!!endAdornment}>
				<span className="flex-shrink-0 px-2">{endAdornment}</span>
			</If>
		</div>
	);
};

export const TextArea: FC<IntrinsicElements["textarea"] & TextFieldProps> = ({
	endAdornment,
	className,
	inputClassName,
	children,
	...props
}) => {
	return (
		<div
			className={classNames(
				className,
				"border-hero flex w-full items-center justify-between border-2 bg-white"
			)}
		>
			<textarea
				{...props}
				className={classNames(
					inputClassName,
					"min-w-0 flex-1 flex-shrink px-2 py-2 outline-none"
				)}
			/>
			<If condition={!!endAdornment}>
				<span className="flex-shrink-0 px-2">{endAdornment}</span>
			</If>
		</div>
	);
};
