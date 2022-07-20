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
	const fallback = `Justification details are published [here](${justificationUri})`;
	if (!justificationUri.includes("pinata")) return fallback;

	const pinataUri = fixPinataGateway(justificationUri);
	const response = await safeFetch(pinataUri);
	if (!response) return;

	return (await response.json())?.justification ?? fallback;
};

const fixPinataGateway = (gatewayUri: string): string => {
	const gatewayUrl = new URL(PINATA_GATEWAY);
	return (
		gatewayUri
			// replace the old gateway url with our new pinata gateway
			.replace("gateway.pinata.cloud", gatewayUrl.host)
			// replace accidental double slashes ``
			.replace("ipfs//", "ipfs/")
	);
};
