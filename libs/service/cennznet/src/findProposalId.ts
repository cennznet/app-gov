import { Api } from "@cennznet/api";
import { stringToHex } from "@polkadot/util";

interface ProposalCriteria {
	justificationUri: string;
	sponsor: string;
}

// only go back up to 5 proposals from the current `nextProposalId``
const FIND_DEPTH = 5;

export const findProposalId = async (
	api: Api,
	criteria: ProposalCriteria
): Promise<number | void> => {
	const nextProposalId =
		((await api.query.governance.nextProposalId())?.toJSON() as number) ?? 0;
	const currentProposalId = Math.max(0, nextProposalId - 1);
	const lastProposalId = Math.max(0, currentProposalId - FIND_DEPTH);

	for (
		let proposalId = currentProposalId;
		proposalId >= lastProposalId;
		proposalId--
	) {
		const proposal = (
			await api.query.governance.proposals(proposalId)
		)?.toJSON() as unknown as Partial<ProposalCriteria>;

		if (!proposal) continue;
		if (
			proposal?.justificationUri === stringToHex(criteria.justificationUri) &&
			proposal?.sponsor === criteria.sponsor
		)
			return proposalId;
	}
};
