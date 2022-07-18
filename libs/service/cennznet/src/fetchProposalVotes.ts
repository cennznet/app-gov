import { Api } from "@cennznet/api";
import type { u128 } from "@cennznet/types";

export interface ProposalVotes {
	passVotes: number;
	rejectVotes: number;
}

/**
 * Fetches proposal votes
 *
 * @param {Api} api
 * @param {number} proposalId
 * @return {Promise<ProposalVotes>}
 */
export const fetchProposalVotes = async (
	api: Api,
	proposalId: number
): Promise<ProposalVotes> => {
	const proposalVotes = await api.query.governance.proposalVotes(proposalId);
	const { activeBits, voteBits } = proposalVotes as unknown as {
		activeBits: u128[];
		voteBits: u128[];
	};

	return getVotesFromBits(activeBits, voteBits);
};

export const getVotesFromBits = (
	activeBits: u128[],
	voteBits: u128[]
): ProposalVotes => {
	const activeCount = countOnes(activeBits);
	const passCount = countOnes(voteBits);
	return {
		passVotes: passCount,
		rejectVotes: activeCount - passCount,
	};
};

/**
 * Counts the number of ones in binary form
 *
 * @param {u128[]} bits
 * @return {number} Number of ones.
 */
function countOnes(bits: u128[]): number {
	return bits
		?.map((bit) => {
			return bit.toNumber().toString(2).match(/1/g)?.length ?? 0;
		})
		.reduce((total, acc) => total + acc, 0);
}
