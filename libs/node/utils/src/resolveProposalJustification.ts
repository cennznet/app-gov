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
	const uriType = determineUriType(justificationUri);

	if (uriType === "unknown") return;
	const fallback = `Justification details is published [here](${justificationUri})`;

	if (uriType === "external") return fallback;

	const pinataUri = fixPinataGateway(justificationUri);

	let response;
	try {
		response = await safeFetch(pinataUri);
	} catch (error) {
		console.error(error);
	}

	if (!response) return;

	return (await response.json())?.justification ?? fallback;
};

type UriType = "external" | "pinata" | "unknown";
const determineUriType = (justificationUri: string): UriType => {
	let justificationUrl: URL;
	try {
		justificationUrl = new URL(justificationUri);
	} catch (error) {
		return "unknown";
	}
	const gatewayUrl = new URL(PINATA_GATEWAY);

	const external = ["hackmd.io", "medium.com"].some(
		(domain) => justificationUrl.host.indexOf(domain) >= 0
	);

	if (external) return "external";

	const pinata = ["gateway.pinata.cloud", gatewayUrl.host].some(
		(domain) => justificationUrl.host.indexOf(domain) >= 0
	);

	if (pinata) return "pinata";

	return "unknown";
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
