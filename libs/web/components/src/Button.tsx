import type { PropsWithChildren, IntrinsicElements } from "@app-gov/web/types";

import { FC, ReactNode } from "react";
import { classNames, If } from "react-extras";

interface ButtonProps extends PropsWithChildren {
	variant?: "hero" | "white";
	size?: "small" | "medium";
	startAdornment?: ReactNode;
	active?: boolean;
}

export const Button: FC<IntrinsicElements["button"] & ButtonProps> = ({
	variant = "hero",
	type = "button",
	size = "medium",
	active,
	startAdornment,
	className,
	children,
	...props
}) => {
	return (
		<button
			type={type}
			className={classNames(
				className,
				"relative inline-flex items-center transition-colors duration-150 disabled:translate-x-0 disabled:translate-y-0 disabled:border-slate-600 disabled:bg-slate-100 disabled:text-slate-600 disabled:shadow-none",
				{
					hero: "bg-hero  border-hero font-display shadow-sharp shadow-dark hover:text-hero hover:bg-light translate-y-[-3px] translate-x-[-3px] border-[3px] uppercase text-white active:translate-y-0 active:translate-x-0 active:shadow-none",

					white:
						" border-hero  font-display shadow-sharp shadow-dark text-hero hover:bg-light top-[-3px] translate-y-[-3px] translate-x-[-3px] bg-white uppercase active:translate-y-0 active:translate-x-0 active:shadow-none",
				}[variant],

				{
					small: "px-2 py-1 text-sm",
					medium: "px-2 py-1 text-lg",
				}[size],

				active && `bg-light text-hero translate-y-0 translate-x-0 shadow-none`
			)}
			{...props}
		>
			<If condition={!!startAdornment}>
				<span className="mr-2">{startAdornment}</span>
			</If>
			<span className="flex-1">{children}</span>
		</button>
	);
};
