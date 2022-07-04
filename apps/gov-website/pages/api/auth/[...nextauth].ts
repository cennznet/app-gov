import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

import { DISCORD_CLIENT, TWITTER_CLIENT } from "@app-gov/service/constants";

export default NextAuth({
	pages: {
		signIn: "/popup/signin",
	},

	providers: [
		TwitterProvider({
			...TWITTER_CLIENT,
			version: "2.0",
			authorization: {
				url: "https://twitter.com/i/oauth2/authorize",
				params: { scope: "users.read tweet.read" },
			},
			profile({ data }) {
				return {
					id: data.id,
					name: `twitter://${data.username}`,
				};
			},
		}),
		DiscordProvider({
			...DISCORD_CLIENT,
			profile(data) {
				return {
					id: data.id,
					name: `discord://${data.username}#${data.discriminator}`,
				};
			},
		}),
	],
});
