import { FC } from "react";

import type { IntrinsicElements, PropsWithChildren } from "@app-gov/web/types";
import { BackdropSrc } from "@app-gov/web/vectors";

interface LayoutProps extends PropsWithChildren {}

export const Layout: FC<IntrinsicElements["div"] & LayoutProps> = ({
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
