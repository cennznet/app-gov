import { CENNZNetNetwork } from "@cennznet/api/types";

export const CENNZ_NETWORK = {
	local: {
		ChainSlug: "local",
		ChainName: "Local Testnet",
		ExplorerUrl: "https://localhost",
	},
	rata: {
		ChainSlug: "rata",
		ChainName: "Rata Testnet",
		ExplorerUrl: "https://rata.uncoverexplorer.com",
	},

	nikau: {
		ChainSlug: "nikau",
		ChainName: "Nikau Testnet",
		ExplorerUrl: "https://nikau.uncoverexplorer.com",
	},

	azalea: {
		ChainSlug: "rata",
		ChainName: "CENNZnet Mainnet",
		ExplorerUrl: "https://uncoverexplorer.com",
	},
}[(process.env.NX_CENNZ_NETWORK ?? "local") as CENNZNetNetwork];
