import type { PropsWithChildren, IntrinsicElements } from "@app-gov/web/types";

import { FC } from "react";
import { CENNZNetLogoSrc } from "@app-gov/web/vectors";

interface HeaderProps extends PropsWithChildren {}

export const Header: FC<IntrinsicElements["div"] & HeaderProps> = ({
	children,
	...props
}) => {
	return (
		<header {...props} className="py-12 px-20">
			<div className="flex items-center">
				<img
					src={CENNZNetLogoSrc}
					alt="CENNZet"
					className=" block h-20 py-2 pr-6"
				/>
				<div className="border-hero self-stretch border"></div>
				<div className="pl-6">
					<h1 className="font-display text-hero  shadow-sharp-2 mb-1 bg-white py-[0.4px] px-[12px] text-4xl font-normal uppercase shadow-black [text-shadow:1px_1px_0px_black]">
						Governance
					</h1>
					<h2 className="font-body text-hero shadow-sharp-2 inline-block bg-white py-[0.4px] px-[12px] uppercase shadow-black [text-shadow:1px_1px_0px_black]">
						Platform
					</h2>
				</div>
			</div>
			{children}
		</header>
	);
};
