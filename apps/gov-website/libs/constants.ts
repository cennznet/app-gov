import { OAuthUserConfig } from "next-auth/providers";

export const CENNZ_NETWORK = {
	rata: {
		ChainName: "Rata Testnet",
		ApiUrl: {
			InWebSocket: "wss://rata.centrality.me/public/ws",
		},
		ExplorerUrl: "https://rata.uncoverexplorer.com",
	},

	nikau: {
		ChainName: "Nikau Testnet",
		ApiUrl: {
			InWebSocket: "wss://nikau.centrality.me/public/ws",
		},
		ExplorerUrl: "https://nikau.uncoverexplorer.com",
	},

	azalea: {
		ChainName: "CENNZnet Mainnet",
		ApiUrl: {
			InWebSocket: "wss://cennznet.unfrastructure.io/public/ws",
		},
		ExplorerUrl: "https://uncoverexplorer.com",
	},
}[process.env.NEXT_PUBLIC_CENNZ_NETWORK ?? "rata"];

export const DISCORD_CLIENT: Pick<
	OAuthUserConfig<"discord">,
	"clientId" | "clientSecret"
> = {
	clientId: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
};

export const TWITTER_CLIENT: Pick<
	OAuthUserConfig<"twitter">,
	"clientId" | "clientSecret"
> = {
	clientId: process.env.TWITTER_CLIENT_ID,
	clientSecret: process.env.TWITTER_CLIENT_SECRET,
};

export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET ?? "";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const PINATA_JWT: string = process.env.PINATA_JWT || "";

export const IPFS_GATEWAY: string = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "";
