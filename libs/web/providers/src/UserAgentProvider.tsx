import { createContext, FC, useContext, useEffect, useState } from "react";
import type { IBrowser, IDevice, IOS } from "ua-parser-js";

import { PropsWithChildren } from "@app-gov/web/utils";

type RuntimeMode = "ReadOnly" | "ReadWrite";

type UserAgentContextType = {
	browser: IBrowser;
	os: IOS;
	device: IDevice;
	runtimeMode?: RuntimeMode;
};

type UserAgent = Omit<UserAgentContextType, "runtimeMode">;

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
	const [userAgent, setUserAgent] = useState<UserAgent>({} as UserAgent);
	const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>();

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
		if (!userAgent?.browser?.name || !userAgent?.os?.name) return;

		const { browser, os } = userAgent;

		if (
			browser.name === "Safari" ||
			browser.name === "Firefox" ||
			os.name === "iOS" ||
			os.name === "Android"
		)
			return setRuntimeMode("ReadOnly");

		setRuntimeMode("ReadWrite");
	}, [userAgent]);

	return (
		<UserAgentContext.Provider value={{ ...userAgent, runtimeMode }}>
			{children}
		</UserAgentContext.Provider>
	);
};

export function useUserAgent(): UserAgentContextType {
	return useContext(UserAgentContext);
}
