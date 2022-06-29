import { createContext, FC, useContext, useEffect, useState } from "react";
import type { IBrowser, IOS, IDevice } from "ua-parser-js";
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

	return (
		<UserAgentContext.Provider value={userAgent}>
			{children}
		</UserAgentContext.Provider>
	);
};

export function useUserAgent(): UserAgentContextType {
	return useContext(UserAgentContext);
}
