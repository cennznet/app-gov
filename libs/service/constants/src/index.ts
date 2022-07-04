import { CENNZNetNetwork } from "@cennznet/api/types";
import { OAuthUserConfig } from "next-auth/providers";

export const CENNZ_NETWORK = {
	local: {
		ChainSlug: "local" as CENNZNetNetwork,
		ChainName: "Local Testnet",
		ExplorerUrl: "https://localhost",
	},
	rata: {
		ChainSlug: "rata" as CENNZNetNetwork,
		ChainName: "Rata Testnet",
		ExplorerUrl: "https://rata.uncoverexplorer.com",
	},

	nikau: {
		ChainSlug: "nikau" as CENNZNetNetwork,
		ChainName: "Nikau Testnet",
		ExplorerUrl: "https://nikau.uncoverexplorer.com",
	},

	azalea: {
		ChainSlug: "azalea" as CENNZNetNetwork,
		ChainName: "CENNZnet Mainnet",
		ExplorerUrl: "https://uncoverexplorer.com",
	},
}[(process.env.NX_CENNZ_NETWORK ?? "local") as CENNZNetNetwork];

export const DISCORD_CLIENT: Pick<
	OAuthUserConfig<"discord">,
	"clientId" | "clientSecret"
> = {
	clientId: process.env.DISCORD_CLIENT_ID ?? "",
	clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
};

export const TWITTER_CLIENT: Pick<
	OAuthUserConfig<"twitter">,
	"clientId" | "clientSecret"
> = {
	clientId: process.env.TWITTER_CLIENT_ID ?? "",
	clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
};

export const PINATA_JWT: string = process.env.NX_PINATA_JWT ?? "";
export const PINATA_GATEWAY: string = process.env.NX_PINATA_GATEWAY ?? "";

export const MONGODB_SERVER: string = process.env.MONGODB_SERVER ?? "";
