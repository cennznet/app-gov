import { CENNZNetNetwork } from "@cennznet/api/types";

export interface NetworkDetails {
	ChainSlug: CENNZNetNetwork;
	ChainName: string;
	ChainExplorer: string;
	Website: string;
}

const networks: Record<CENNZNetNetwork, NetworkDetails> = {
	local: {
		ChainSlug: "local",
		ChainName: "Local Testnet",
		ChainExplorer: "http://localhost",
		Website: "http://localhost:4200",
	},
	rata: {
		ChainSlug: "rata",
		ChainName: "Rata Testnet",
		ChainExplorer: "https://rata.uncoverexplorer.com",
		Website: "",
	},
	nikau: {
		ChainSlug: "nikau",
		ChainName: "Nikau Testnet",
		ChainExplorer: "https://nikau.uncoverexplorer.com",
		Website: "https://gov.nikau.centrality.me",
	},
	azalea: {
		ChainSlug: "azalea",
		ChainName: "CENNZnet Mainnet",
		ChainExplorer: "https://uncoverexplorer.com",
		Website: "https://gov.cennz.net",
	},
};

export const getNetworkDetails = (name: CENNZNetNetwork): NetworkDetails => {
	return networks[name];
};
