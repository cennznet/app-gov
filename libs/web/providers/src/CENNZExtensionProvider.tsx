import type * as Extension from "@polkadot/extension-dapp";
import {
	InjectedAccountWithMeta,
	InjectedExtension,
} from "@polkadot/extension-inject/types";
import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { PropsWithChildren } from "@app-gov/web/utils";

import { useUserAgent } from "./UserAgentProvider";

declare global {
	interface Window {
		injectedWeb3: {
			"polkadot-js"?: { version: string };
			"cennznet-extension"?: { version: string };
		};
	}
}

interface CENNZExtensionContextType {
	accounts?: InjectedAccountWithMeta[];
	promptInstallExtension: () => void;
	getInstalledExtension?: () => Promise<InjectedExtension>;
}

const CENNZExtensionContext = createContext<CENNZExtensionContextType>(
	{} as CENNZExtensionContextType
);

interface CENNZExtensionProviderProps extends PropsWithChildren {
	appName: string;
}

export const CENNZExtensionProvider: FC<CENNZExtensionProviderProps> = ({
	appName,
	children,
}) => {
	const { runtimeMode } = useUserAgent();
	const [module, setModule] = useState<typeof Extension>();
	const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();

	const promptDisableExtension = useCallback(() => {
		const url =
			"https://support.google.com/chrome_webstore/answer/2664769?p=enable_extensions&rd=1#extensionpermissions";

		const confirmed = window.confirm(
			"Please turn off polkadot{.js} extension, enable CENNZnet extension, and refresh the page before continuing."
		);

		if (!confirmed) return;

		window.open(url, "_blank");
	}, []);

	const promptInstallExtension = useCallback(() => {
		const url =
			"https://chrome.google.com/webstore/detail/cennznet-extension/feckpephlmdcjnpoclagmaogngeffafk";

		const confirmed = window.confirm(
			"Please install CENNZnet Extension for your browser and create at least one account to continue."
		);

		if (!confirmed) return;

		window.open(url, "_blank");
	}, []);

	useEffect(() => {
		import("@polkadot/extension-dapp").then(setModule);
	}, []);

	const getInstalledExtension = useMemo(() => {
		if (!module) return;

		return async () => {
			const { web3Enable, web3FromSource } = module;
			await web3Enable(appName);
			return await web3FromSource("cennznet-extension");
		};
	}, [appName, module]);

	useEffect(() => {
		if (!module || !runtimeMode || runtimeMode === "ReadOnly") return;
		let unsubscribe: () => void;

		const fetchAccounts = async () => {
			const { web3Enable, web3Accounts, web3AccountsSubscribe } = module;

			if (window.injectedWeb3?.["polkadot-js"]) {
				return promptDisableExtension?.();
			}

			await web3Enable(appName);
			const accounts = (await web3Accounts()) || [];
			if (!accounts.length)
				return alert(
					"Please create at least one account in CENNZnet extension to continue."
				);

			setAccounts(accounts);

			unsubscribe = await web3AccountsSubscribe((accounts) => {
				setAccounts([...accounts]);
			});
		};

		void fetchAccounts();

		return () => unsubscribe?.();
	}, [appName, module, runtimeMode, promptDisableExtension]);

	return (
		<CENNZExtensionContext.Provider
			value={{
				...module,
				accounts,
				getInstalledExtension,
				promptInstallExtension,
			}}
		>
			{children}
		</CENNZExtensionContext.Provider>
	);
};

export function useCENNZExtension(): CENNZExtensionContextType {
	return useContext(CENNZExtensionContext);
}
