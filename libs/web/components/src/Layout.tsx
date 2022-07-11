import { FC } from "react";

import type { IntrinsicElements, PropsWithChildren } from "@app-gov/web/types";
import { BackdropSrc } from "@app-gov/web/vectors";

interface LayoutProps extends PropsWithChildren {}

const PageWrapper: FC<IntrinsicElements["div"] & LayoutProps> = ({
	children,
	...props
}) => {
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

const PageContent: FC<PropsWithChildren> = ({ children }) => (
	<div className="w-full max-w-2xl flex-1 self-center px-8 pb-12 lg:max-w-3xl">
		{children}
	</div>
);

const PageHeader: FC<PropsWithChildren> = ({ children }) => (
	<h1 className="font-display text-hero mb-[0.4em] text-center text-6xl uppercase">
		{children}
	</h1>
);

export const Layout = {
	PageWrapper,
	PageContent,
	PageHeader,
};
