import { forwardRef, ReactNode } from "react";
import { classNames, If } from "react-extras";

import type { IntrinsicElements, PropsWithChildren } from "@app-gov/web/types";

interface SelectProps extends PropsWithChildren {
	placeholder?: string;
	endAdornment?: ReactNode;
	inputClassName?: string;
}

export const Select = forwardRef<
	HTMLSelectElement,
	IntrinsicElements["select"] & SelectProps
>(
	(
		{
			children,
			placeholder,
			endAdornment,
			className,
			inputClassName,
			defaultValue,
			value,
			...props
		},
		ref
	) => {
		const shouldShowPlaceholder = !!placeholder && !defaultValue && !value;

		return (
			<div
				className={classNames(
					className,
					"border-hero relative flex w-full items-center justify-between border-2 bg-white"
				)}
			>
				<If condition={shouldShowPlaceholder}>
					<div
						className={classNames(
							inputClassName,
							"absolute inset-0 mr-2 flex-1 bg-white px-2 py-2 text-slate-500"
						)}
					>
						{placeholder}
					</div>
				</If>
				<select
					{...props}
					defaultValue={defaultValue}
					value={value}
					ref={ref}
					className={classNames(
						inputClassName,
						"mr-2 min-w-0 flex-1 cursor-pointer border-none bg-white px-2 py-2 outline-none",
						shouldShowPlaceholder ? "opacity-0" : "opacity"
					)}
				>
					{children}
				</select>

				<If condition={!!endAdornment}>
					<span className="px-2">{endAdornment}</span>
				</If>
			</div>
		);
	}
);
