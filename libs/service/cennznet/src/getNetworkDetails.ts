import { CENNZNetNetwork } from "@cennznet/api/types";

export interface NetworkDetails {
	ChainSlug: CENNZNetNetwork;
	ChainName: string;
	ChainExplorer: string;
}

const networks: Record<CENNZNetNetwork, NetworkDetails> = {
	local: {
		ChainSlug: "local",
		ChainName: "Local Testnet",
		ChainExplorer: "http://localhost",
	},
	rata: {
		ChainSlug: "rata",
		ChainName: "Rata Testnet",
		ChainExplorer: "https://rata.uncoverexplorer.com",
	},
	nikau: {
		ChainSlug: "nikau",
		ChainName: "Nikau Testnet",
		ChainExplorer: "https://nikau.uncoverexplorer.com",
	},
	azalea: {
		ChainSlug: "azalea",
		ChainName: "CENNZnet Mainnet",
		ChainExplorer: "https://uncoverexplorer.com",
	},
};

export const getNetworkDetails = (name: CENNZNetNetwork): NetworkDetails => {
	return networks[name];
};
