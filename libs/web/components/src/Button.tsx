import { FC, ReactNode } from "react";
import { classNames, If } from "react-extras";

import type { IntrinsicElements, PropsWithChildren } from "@app-gov/web/utils";

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
				"font-display relative inline-flex items-center transition-colors duration-150 disabled:translate-x-0 disabled:translate-y-0 disabled:border-slate-600 disabled:bg-slate-100 disabled:text-slate-600 disabled:shadow-none",
				{
					hero: "bg-hero border-hero shadow-sharp shadow-hero/40 hover:text-hero translate-y-[-3px] translate-x-[-3px] border-2 uppercase text-white hover:bg-white active:translate-y-0 active:translate-x-0 active:shadow-none",

					white:
						"shadow-sharp shadow-hero/40 text-hero hover:border-hero translate-y-[-3px] translate-x-[-3px] border-2 border-white bg-white uppercase hover:bg-white active:translate-y-0 active:translate-x-0 active:shadow-none ",
				}[variant],

				{
					small: "px-2 py-1 text-xs",
					medium: "px-2 py-1",
				}[size],

				active &&
					`!bg-light !text-hero pointer-events-none translate-y-0 translate-x-0 shadow-none`
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
