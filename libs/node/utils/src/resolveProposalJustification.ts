import { PINATA_GATEWAY } from "@app-gov/service/env-vars";

import { safeFetch } from "./";

/**
 * Resolve justification content from a uri
 *
 * @param {string} justificationUri
 * @return {Promise<string>}
 */
export const resolveProposalJustification = async (
	justificationUri: string
): Promise<string | void> => {
	const fallback = `Justification details is published [here](${justificationUri})`;
	if (justificationUri.indexOf(PINATA_GATEWAY) < 0) return fallback;

	//TODO: Improve error handling for malformed URL
	const response = await safeFetch(justificationUri.replace("ipfs//", "ipfs/"));
	if (!response) return;

	return (await response.json())?.justification ?? fallback;
};
