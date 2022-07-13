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
	useState,
} from "react";
import store from "store";

import type { PropsWithChildren } from "@app-gov/web/types";

import { useCENNZApi } from "./CENNZApiProvider";
import { useCENNZExtension } from "./CENNZExtensionProvider";
import { useUserAgent } from "./UserAgentProvider";

interface CENNZWalletContextType {
	selectedAccount?: InjectedAccountWithMeta;
	wallet?: InjectedExtension;
	connectWallet: (callback?: () => void) => Promise<void>;
	disconnectWallet: () => void;
	selectAccount: (account: InjectedAccountWithMeta) => void;
}

const CENNZWalletContext = createContext<CENNZWalletContextType>(
	{} as CENNZWalletContextType
);

interface CENNZWalletProviderProps extends PropsWithChildren {}

export const CENNZWalletProvider: FC<CENNZWalletProviderProps> = ({
	children,
}) => {
	const { api } = useCENNZApi();
	const { runtimeMode } = useUserAgent();
	const { promptInstallExtension, getInstalledExtension, accounts } =
		useCENNZExtension();
	const [wallet, setWallet] = useState<InjectedExtension>();
	const [cennzAccount, setCENNZAccount] = useState<InjectedAccountWithMeta>();

	const connectWallet = useCallback(async () => {
		if (!api || !runtimeMode || runtimeMode === "ReadOnly") return;

		const extension = await getInstalledExtension?.();

		if (!extension) {
			return promptInstallExtension?.();
		}

		setWallet(extension);
		store.set("CENNZNET-EXTENSION", extension);
	}, [api, getInstalledExtension, promptInstallExtension, runtimeMode]);

	const disconnectWallet = useCallback(() => {
		store.remove("CENNZNET-EXTENSION");
		store.remove("CENNZNET-ACCOUNT");
		setWallet(undefined);
		setCENNZAccount(undefined);
	}, []);

	const selectAccount = useCallback((account: InjectedAccountWithMeta) => {
		setCENNZAccount(account);
		store.set("CENNZNET-ACCOUNT", account);
	}, []);

	// 1. Restore the wallet from the store if it exists
	useEffect(() => {
		async function restoreWallet() {
			const storedWallet = store.get("CENNZNET-EXTENSION");
			if (!storedWallet) return disconnectWallet();
			const extension = await getInstalledExtension?.();
			setWallet(extension);
		}

		void restoreWallet();
	}, [disconnectWallet, getInstalledExtension]);

	// 2. Pick the right account once a `wallet` has been set
	useEffect(() => {
		if (!wallet || !accounts || !selectAccount) return;

		const storedAccount = store.get("CENNZNET-ACCOUNT");
		if (!storedAccount) return selectAccount(accounts[0]);

		const matchedAccount = accounts.find(
			(account) => account.address === storedAccount.address
		);
		if (!matchedAccount) return selectAccount(accounts[0]);

		selectAccount(matchedAccount);
	}, [wallet, accounts, selectAccount]);

	return (
		<CENNZWalletContext.Provider
			value={{
				selectedAccount: cennzAccount,
				wallet,
				connectWallet,
				disconnectWallet,
				selectAccount,
			}}
		>
			{children}
		</CENNZWalletContext.Provider>
	);
};

export function useCENNZWallet(): CENNZWalletContextType {
	return useContext(CENNZWalletContext);
}
