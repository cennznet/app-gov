interface AllowedExtrinsics {
	Sections: string[];
	Methods: Record<string, string[]>;
}

export const ALLOWED_EXTRINSICS: AllowedExtrinsics = {
	Sections: [
		"baseFee",
		"erc20Peg",
		"governance",
		"grandpa",
		"rewards",
		"staking",
	],
	Methods: {
		baseFee: ["setBaseFeePerGas", "setElasticity", "setIsActive"],
		erc20Peg: [
			"activateDeposits",
			"activateWithdrawals",
			"activateCennzDeposits",
		],
		governance: [
			"addCouncilMember",
			"cancelEnactment",
			"enactReferendum",
			"removeCouncilMember",
		],
		grandpa: ["noteStalled"],
		rewards: [
			"forceNewFiscalEra",
			"setDevelopmentFundTake",
			"setInflationRate",
		],
		staking: ["cancelDeferredSlash", "forceNewEra"],
	},
};
