import { capitalize } from "lodash-es";
import type { NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Layout } from "@app-gov/web/components";

const SignIn: NextPage = () => {
	const {
		query: { provider = "twitter", callback = false, error },
	} = useRouter();

	useEffect(() => {
		if (!callback && (!error || error === "OAuthCallback")) {
			const id = setTimeout(() => {
				signIn(provider as BuiltInProviderType, {
					callbackUrl: `/popup/signin?provider=${provider}&callback=1`,
				});
			}, 1000);

			return () => clearTimeout(id);
		}

		window.close();
	}, [provider, callback, error]);

	return (
		<Layout.PageWrapper>
			<div className="flex flex-1 flex-col items-center justify-center">
				<div>
					Redirecting to {capitalize(provider as BuiltInProviderType)} for
					authentication...
				</div>
			</div>
		</Layout.PageWrapper>
	);
};

export default SignIn;
