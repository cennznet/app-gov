import { Api } from "@cennznet/api";
import { EraIndex } from "@cennznet/types";

export const fetchProposalVetoPercentage = async (
	api: Api,
	proposalId: number
): Promise<number> => {
	const [vetoSum, totalStaked] = await Promise.all([
		fetchProposalVetoSum(api, proposalId),
		fetchTotalStaked(api),
	]);

	if (!vetoSum || !totalStaked) return 0;
	const permill = vetoSum / totalStaked;
	return permill * 100;
};

export const fetchTotalStaked = async (api: Api): Promise<number> => {
	const currentEra = (await api.query.staking.currentEra()) as EraIndex;
	return (
		await api.query.staking.erasTotalStake(currentEra.toJSON())
	)?.toJSON() as number;
};

export const fetchProposalVetoSum = async (
	api: Api,
	proposalId: number
): Promise<number> => {
	const sum = await api.query.governance.referendumVetoSum(proposalId);
	return sum.toJSON() as number;
};

export const fetchProposalVetoThreshold = async (api: Api): Promise<number> => {
	const threshold = await api.query.governance.referendumThreshold();
	return parseFloat(threshold.toHuman() as string);
};
