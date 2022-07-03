import { Api } from "@cennznet/api";

interface Identity {
	info: {
		discord: {
			blakeTwo256: string;
		};

		twitter: {
			blakeTwo256: string;
		};
	};
}

export const fetchIdentityOf = async (
	api: Api,
	account: string
): Promise<Identity | undefined> => {
	const response = await api.query.identity.identityOf(account);
	return response.toJSON() as unknown as Identity;
};
