/* eslint-disable react/jsx-key */
import type { AppProps } from "next/app";
import Head from "next/head";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	MainProvider,
	CENNZApiProvider,
	CENNZExtensionProvider,
	CENNZWalletProvider,
	UserAgentProvider,
	ProposalProvider,
} from "@app-gov/web/providers";
import { FC } from "react";
import { SessionProvider } from "next-auth/react";

import "@app-gov/website/globals.css";

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
					<ProposalProvider />,
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
