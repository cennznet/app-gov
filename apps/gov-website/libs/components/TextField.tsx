import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import { classNames, If, Choose } from "react-extras";

interface TextFieldProps extends PropsWithChildren {
	multiline?: boolean;
	endAdornment?: ReactNode;
	inputClassName?: string;
}

export const TextField: FC<
	IntrinsicElements["input"] & IntrinsicElements["textarea"] & TextFieldProps
> = ({
	type = "text",
	multiline = false,
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
				"border-dark flex w-full items-center justify-between border-[3px] bg-white"
			)}
		>
			<Choose>
				<Choose.When condition={multiline}>
					<textarea
						{...props}
						className={classNames(
							inputClassName,
							"min-w-0 flex-shrink px-4 py-2 outline-none"
						)}
					/>
				</Choose.When>

				<Choose.When condition={!multiline}>
					<input
						{...props}
						type={type}
						className={classNames(
							inputClassName,
							"min-w-0 flex-shrink px-4 py-2 outline-none"
						)}
					/>
				</Choose.When>
			</Choose>
			<If condition={!!endAdornment}>
				<span className="flex-shrink-0 px-2">{endAdornment}</span>
			</If>
		</div>
	);
};
