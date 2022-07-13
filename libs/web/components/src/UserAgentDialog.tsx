import { FC, useEffect, useState } from "react";

import { useUserAgent } from "@app-gov/web/providers";

import { Dialog } from "./";

export const UserAgentDialog: FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const { browser } = useUserAgent();

	useEffect(() => {
		if (!browser?.name) return;

		if (browser.name === "Firefox" || browser.name === "Safari") setOpen(true);
	}, [browser?.name]);

	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<div className="border-hero bg-light shadow-sharp shadow-dark -mx-[4em] flex h-full flex-col items-center justify-center border-4 p-8">
				<p className="prose w-full text-center text-base">
					Sorry, this browser is not supported by this app. To participate in
					our Governance Platform, please use Chrome or its variants on a Mac or
					PC.
				</p>
			</div>
		</Dialog>
	);
};
