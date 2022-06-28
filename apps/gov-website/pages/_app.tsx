/* eslint-disable react/jsx-key */
import "@gov-app/libs/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { CENNZ_NETWORK } from "@gov-app/libs/constants";
import { MainProvider } from "@gov-app/libs/providers/MainProvider";
import { CENNZApiProvider } from "@gov-app/libs/providers/CENNZApiProvider";
import { CENNZExtensionProvider } from "@gov-app/libs/providers/CENNZExtensionProvider";
import { CENNZWalletProvider } from "@gov-app/libs/providers/CENNZWalletProvider";
import { UserAgentProvider } from "@gov-app/libs/providers/UserAgentProvider";
import { FC } from "react";
import { SessionProvider } from "next-auth/react";

const NextApp: FC<AppProps> = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) => {
	return (
		<SessionProvider session={session}>
			<MainProvider
				providers={[
					<UserAgentProvider />,
					<CENNZExtensionProvider appName="CENNZnet Governance" />,
					<CENNZApiProvider endpoint={CENNZ_NETWORK.ApiUrl.InWebSocket} />,
					<CENNZWalletProvider />,
				]}
			>
				<Head>
					<title>CENNZnet | Governance Platform</title>
				</Head>
				<Component {...pageProps} />
			</MainProvider>
		</SessionProvider>
	);
};

export default NextApp;
