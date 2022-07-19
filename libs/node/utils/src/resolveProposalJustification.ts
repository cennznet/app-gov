import { PINATA_GATEWAY } from "@app-gov/service/env-vars";

/**
 * Resolve justification content from a uri
 *
 * @param {string} justificationUri
 * @return {Promise<string>}
 */
export const resolveProposalJustification = async (
	justificationUri: string
): Promise<string> => {
	const fallback = `Justification details is published [here](${justificationUri})`;

	if (justificationUri.indexOf(PINATA_GATEWAY) < 0) return fallback;

	const response = await fetch(justificationUri);
	const data = await response.json();

	if (!response.ok) {
		throw {
			code: `PINATA/${data?.error?.reason ?? response.status}`,
			message: data?.error?.details ?? response.statusText,
		};
	}

	return data?.justification ?? fallback;
};
