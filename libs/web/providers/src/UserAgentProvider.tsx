import {
	ComponentProps,
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
} from "react";
import type { IBrowser, IDevice, IOS } from "ua-parser-js";

import { Dialog } from "@app-gov/web/components";
import { PropsWithChildren } from "@app-gov/web/types";

type UserAgentContextType = {
	browser: IBrowser;
	os: IOS;
	device: IDevice;
};

const UserAgentContext = createContext<UserAgentContextType>(
	{} as UserAgentContextType
);

interface UserAgentProviderProps extends PropsWithChildren {
	value?: string;
}

export const UserAgentProvider: FC<UserAgentProviderProps> = ({
	children,
	value,
}) => {
	const [userAgent, setUserAgent] = useState<UserAgentContextType>(
		{} as UserAgentContextType
	);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		import("ua-parser-js").then(({ default: UAParser }) => {
			const instance = new UAParser(value);
			setUserAgent({
				browser: instance.getBrowser(),
				device: instance.getDevice(),
				os: instance.getOS(),
			});
		});
	}, [value]);

	useEffect(() => {
		if (!userAgent?.browser?.name) return;

		if (
			userAgent?.browser.name === "Firefox" ||
			userAgent?.browser.name === "Safari"
		)
			setOpen(true);
	}, [userAgent?.browser?.name]);

	return (
		<div>
			<UserAgentContext.Provider value={userAgent}>
				{children}
			</UserAgentContext.Provider>

			<UserAgentDialog open={open} onClose={() => setOpen(false)} />
		</div>
	);
};

export function useUserAgent(): UserAgentContextType {
	return useContext(UserAgentContext);
}

export interface UserAgentDialogProps extends ComponentProps<typeof Dialog> {}

const UserAgentDialog: FC<UserAgentDialogProps> = (props) => (
	<Dialog {...props}>
		<div className="border-hero bg-light shadow-sharp shadow-dark -mx-[4em] flex h-full flex-col items-center justify-center border-4 p-8">
			<p className="prose w-full text-center text-base">
				Sorry, this browser is not supported by this app. To participate in our
				Governance Platform, please use Chrome or its variants on a Mac or PC.
			</p>
		</div>
	</Dialog>
);
