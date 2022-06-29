import type { PropsWithChildren, IntrinsicElements } from "@app-gov/web/types";

import { FC, ReactNode } from "react";
import { classNames, If } from "react-extras";

interface SelectProps extends PropsWithChildren {
	placeholder?: string;
	endAdornment?: ReactNode;
	inputClassName?: string;
}

export const Select: FC<IntrinsicElements["select"] & SelectProps> = ({
	children,
	placeholder,
	endAdornment,
	className,
	inputClassName,
	defaultValue,
	...props
}) => {
	return (
		<div
			className={classNames(
				className,
				"border-dark relative flex w-full items-center justify-between border-[3px] bg-white"
			)}
		>
			<If condition={!defaultValue && !!placeholder}>
				<div
					className={classNames(
						inputClassName,
						"absolute inset-0 mr-2 flex-1 bg-white px-4 py-2 text-slate-500"
					)}
				>
					{placeholder}
				</div>
			</If>
			<select
				{...props}
				defaultValue={defaultValue}
				className={classNames(
					inputClassName,
					"mr-2 min-w-0 flex-1 border border-white bg-white px-4 py-2 outline-none",
					!!defaultValue || !placeholder ? "opacity" : "opacity-0"
				)}
			>
				{children}
			</select>

			<If condition={!!endAdornment}>
				<span className="px-2">{endAdornment}</span>
			</If>
		</div>
	);
};
