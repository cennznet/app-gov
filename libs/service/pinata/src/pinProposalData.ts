import {
	CENNZ_NETWORK,
	PINATA_GATEWAY,
	PINATA_JWT,
} from "@app-gov/service/constants";

export const pinProposalData = async (
	proposalData: Record<string, unknown>
): Promise<{ hash: string; url: string }> => {
	const response = await fetch(
		"https://api.pinata.cloud/pinning/pinJSONToIPFS",
		{
			method: "POST",
			headers: {
				"Authorization": `Bearer ${PINATA_JWT}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				pinataOptions: {
					cidVersion: 1,
				},
				pinataContent: proposalData,
				pinataMetadata: {
					name: `[${CENNZ_NETWORK.ChainSlug}] Proposal #`,
				},
			}),
		}
	);

	const data = await response.json();

	if (!response.ok)
		throw {
			code: data?.error?.reason ?? response.status,
			message: data?.error?.details ?? response.statusText,
		};

	if (!data.IpfsHash)
		throw {
			code: `UNKNOWN`,
			message: "IpfsHash is not defined",
		};

	return { hash: data.IpfsHash, url: `${PINATA_GATEWAY}/${data.IpfsHash}` };
};
