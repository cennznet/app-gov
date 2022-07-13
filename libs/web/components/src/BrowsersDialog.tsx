import { FC, useEffect, useState } from "react";

import { useUserAgent } from "@app-gov/web/providers";

import { Dialog } from "./";

export const BrowsersDialog: FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const { runtimeMode } = useUserAgent();

	useEffect(() => {
		if (!runtimeMode) return;

		if (runtimeMode === "ReadOnly") setOpen(true);
	}, [runtimeMode]);

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
