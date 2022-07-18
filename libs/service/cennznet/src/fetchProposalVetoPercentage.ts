import { Api } from "@cennznet/api";
import { EraIndex } from "@cennznet/types";

export const fetchProposalVetoPercentage = async (
	api: Api,
	proposalId: number
): Promise<number> => {
	const [vetoSum, totalStaked] = await Promise.all([
		api.query.governance.referendumVetoSum(proposalId),
		fetchTotalStaked(api),
	]);

	if (!vetoSum || !totalStaked) return 0;

	const permill =
		(vetoSum.toJSON() as number) / (totalStaked.toJSON() as number);

	return permill * 100;
};

export const fetchTotalStaked = async (api: Api) => {
	const currentEra = (await api.query.staking.currentEra()) as EraIndex;
	return await api.query.staking.erasTotalStake(currentEra.toJSON());
};
