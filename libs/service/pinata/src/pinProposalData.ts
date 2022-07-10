import {
	CENNZ_NETWORK,
	PINATA_GATEWAY,
	PINATA_JWT,
} from "@app-gov/service/constants";

export const pinProposalData = async (
	proposalData: Record<string, unknown>
): Promise<{ pinHash: string; pinUrl: string }> => {
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
			code: `PINATA/${data?.error?.reason ?? response.status}`,
			message: data?.error?.details ?? response.statusText,
		};

	return {
		pinHash: data.IpfsHash,
		pinUrl: `${PINATA_GATEWAY}/${data.IpfsHash}`,
	};
};

export const updateProposalPinName = async (
	pinHash: string,
	proposalId: number
): Promise<void> => {
	const response = await fetch(
		"https://api.pinata.cloud/pinning/hashMetadata",
		{
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${PINATA_JWT}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ipfsPinHash: pinHash,
				name: `[${CENNZ_NETWORK.ChainSlug}] Proposal #${proposalId}`,
			}),
		}
	);

	if (!response.ok) {
		const data = await response.json();
		throw {
			code: `PINATA/${data?.error?.reason ?? response.status}`,
			message: data?.error?.details ?? response.statusText,
		};
	}
};
