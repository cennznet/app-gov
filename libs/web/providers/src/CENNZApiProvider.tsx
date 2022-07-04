import { Api } from "@cennznet/api";
import { CENNZNetNetwork } from "@cennznet/api/types";
import { createContext, FC, useContext, useEffect, useState } from "react";

import type { PropsWithChildren } from "@app-gov/web/types";

interface CENNZApiContextType {
	api?: Api;
}

const CENNZApiContext = createContext<CENNZApiContextType>(
	{} as CENNZApiContextType
);

interface CENNZApiProviderProps extends PropsWithChildren {
	network: string;
}

export const CENNZApiProvider: FC<CENNZApiProviderProps> = ({
	children,
	network,
}) => {
	const [api, setApi] = useState<Api>();

	useEffect(() => {
		const initApi = () => {
			const instance = new Api({
				network: network as CENNZNetNetwork,
			});

			instance.isReady.then(() => {
				setApi(instance);
				window.onunload = () => instance.disconnect();
			});

			return instance;
		};

		const api = initApi();

		return () => {
			if (api.isConnected) void api.disconnect();
		};
	}, [network]);

	return (
		<CENNZApiContext.Provider value={{ api }}>
			{children}
		</CENNZApiContext.Provider>
	);
};

export function useCENNZApi(): CENNZApiContextType {
	return useContext(CENNZApiContext);
}
