export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET ?? "";

export const CENNZ_NETWORK = {
	rata: {
		ChainName: "Rata Testnet",
		ChainId: {
			InDec: 3000,
			InHex: `0x${Number(3000).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://rata.centrality.me/public/ws",
		},
		ExplorerUrl: "https://rata.uncoverexplorer.com",
		ClaimRelayerUrl: "https://bridge-contracts.rata.centrality.me",
		LinkedEthChain: "ropsten",
	},

	nikau: {
		ChainName: "Nikau Testnet",
		ChainId: {
			InDec: 3001,
			InHex: `0x${Number(3001).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://nikau.centrality.me/public/ws",
		},
		ExplorerUrl: "https://nikau.uncoverexplorer.com",
		ClaimRelayerUrl: "https://bridge-contracts.nikau.centrality.me",
		LinkedEthChain: "kovan",
	},

	azalea: {
		ChainName: "CENNZnet Mainnet",
		ChainId: {
			InDec: 21337,
			InHex: `0x${Number(21337).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://cennznet.unfrastructure.io/public/ws",
		},
		ExplorerUrl: "https://uncoverexplorer.com",
		ClaimRelayerUrl: "https://bridge-contracts.centralityapp.com",
		LinkedEthChain: "mainnet",
	},
}[process.env.NEXT_PUBLIC_CENNZ_NETWORK ?? "rata"];
