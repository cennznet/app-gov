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

import type { PropsWithChildren } from "@app-gov/web/types";

import { useUserAgent } from "./UserAgentProvider";

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
	const { browser, os } = useUserAgent();
	const [module, setModule] = useState<typeof Extension>();
	const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();

	const promptInstallExtension = useCallback(() => {
		if (os.name === "iOS" || os.name === "Android") {
			return alert(
				"Sorry, this browser is not supported by this app. To use this app, please switch to Chrome or its on a Mac or PC."
			);
		}

		const url =
			"https://chrome.google.com/webstore/detail/cennznet-extension/feckpephlmdcjnpoclagmaogngeffafk";

		const confirmed = window.confirm(
			"Please install CENNZnet Extension for your browser and create at least one account to continue."
		);

		if (!confirmed) return;

		window.open(url, "_blank");
	}, [os]);

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
		if (!module || !browser?.name) return;
		let unsubscribe: () => void;

		const fetchAccounts = async () => {
			const { web3Enable, web3Accounts, web3AccountsSubscribe } = module;

			await web3Enable(appName);
			const accounts = (await web3Accounts()) || [];
			if (
				!accounts.length &&
				browser?.name !== "Firefox" &&
				browser?.name !== "Safari"
			)
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
	}, [appName, module, browser?.name]);

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
