import { BASE_URL } from "@app-gov/service/constants";

export const fetchProposal = async (proposalId: string) => {
	const response = await fetch(`${BASE_URL}/api/proposals/${proposalId}`);
	const data = await response.json();

	if (!response.ok)
		throw {
			code: response.status,
			message: data?.message ?? response.statusText,
		};

	return data;
};
