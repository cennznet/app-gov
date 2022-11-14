/* eslint-disable react/jsx-key */
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";

import { CENNZ_NETWORK } from "@app-gov/service/env-vars";
import { BrowsersDialog } from "@app-gov/web/components";
import {
	CENNZApiProvider,
	CENNZExtensionProvider,
	CENNZWalletProvider,
	MainProvider,
	UserAgentProvider,
} from "@app-gov/web/providers";

import FaviconSVG from "../favicon.svg";
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
					<meta
						name="description"
						content="The CENNZnet Decentralised Autonomous Organisation (DAO) gives the community the ability to govern and participate in decisions regarding the network at the protocol level."
					/>
					<link rel="icon" href={FaviconSVG} />
				</Head>
				<Component {...pageProps} />
				<BrowsersDialog />
			</MainProvider>
		</SessionProvider>
	);
};

export default NextApp;
