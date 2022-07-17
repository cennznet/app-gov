import { CENNZNetNetwork } from "@cennznet/api/types";

export interface NetworkDetails {
	chainName: CENNZNetNetwork;
	chainTitle: string;
	chainExplorer: string;
}

const networks: Record<CENNZNetNetwork, NetworkDetails> = {
	local: {
		chainName: "local",
		chainTitle: "Local Testnet",
		chainExplorer: "http://localhost",
	},
	rata: {
		chainName: "rata",
		chainTitle: "Rata Testnet",
		chainExplorer: "https://rata.uncoverexplorer.com",
	},
	nikau: {
		chainName: "nikau",
		chainTitle: "Nikau Testnet",
		chainExplorer: "https://nikau.uncoverexplorer.com",
	},
	azalea: {
		chainName: "azalea",
		chainTitle: "CENNZnet Mainnet",
		chainExplorer: "https://uncoverexplorer.com",
	},
};

export const getNetworkDetails = (name: CENNZNetNetwork): NetworkDetails => {
	return networks[name];
};
