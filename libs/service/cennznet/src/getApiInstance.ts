import { Api } from "@cennznet/api";
import { CENNZNetNetwork } from "@cennznet/api/types";

let api: Api | undefined;
export const getApiInstance = async (
	network: CENNZNetNetwork
): Promise<Api> => {
	if (api && api.isConnected) return api;
	const instance = await Api.create({ network });
	await instance.isReady;
	return (api = instance);
};

export const disconnectApiInstance = async (): Promise<void> => {
	if (api && api.isConnected) await api.disconnect();
	api = undefined;
};
