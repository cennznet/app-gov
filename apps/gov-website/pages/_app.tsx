/* eslint-disable react/jsx-key */
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";

import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	CENNZApiProvider,
	CENNZExtensionProvider,
	CENNZWalletProvider,
	MainProvider,
	UserAgentProvider,
} from "@app-gov/web/providers";

import "../globals.css";

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
					<CENNZApiProvider network={CENNZ_NETWORK.ChainSlug} />,
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
