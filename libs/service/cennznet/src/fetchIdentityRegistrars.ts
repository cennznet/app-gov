import { Api } from "@cennznet/api";

interface IdentityRegistrar {
	account: string;
	fee: number;
	fields: string[];
}

export const fetchIdentityRegistrars = async (
	api: Api
): Promise<IdentityRegistrar[]> => {
	const registrars = await api.query.identity.registrars();
	return registrars.toJSON() as unknown as IdentityRegistrar[];
};
