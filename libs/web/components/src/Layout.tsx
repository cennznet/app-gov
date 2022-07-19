import { FC } from "react";
import { classNames } from "react-extras";

import type { IntrinsicElements } from "@app-gov/web/utils";
import { BackdropSrc } from "@app-gov/web/vectors";

const PageWrapper: FC<IntrinsicElements["div"]> = ({ children, ...props }) => {
	return (
		<>
			<div className="bg-mid fixed inset-0">
				<img
					className="h-full w-full object-cover"
					alt="Backdrop"
					src={BackdropSrc}
				/>
			</div>
			<div {...props} className="relative flex h-full flex-col">
				{children}
			</div>
			<div className="border-hero pointer-events-none fixed inset-0 border-8"></div>
		</>
	);
};

const PageContent: FC<IntrinsicElements["div"]> = ({
	children,
	className,
	...props
}) => (
	<div
		className={classNames(
			className,
			"w-full max-w-2xl flex-1 self-center px-8 pb-12 lg:max-w-3xl"
		)}
		{...props}
	>
		{children}
	</div>
);

const PageHeader: FC<IntrinsicElements["heading"]> = ({
	children,
	className,
	...props
}) => (
	<h1
		className={classNames(
			className,
			"font-display text-hero mb-[1em] text-center text-8xl uppercase"
		)}
		{...props}
	>
		{children}
	</h1>
);

export const Layout = {
	PageWrapper,
	PageContent,
	PageHeader,
};
