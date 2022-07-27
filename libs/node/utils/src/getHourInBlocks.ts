import { Api } from "@cennznet/api";

export const getHourInBlocks = (api: Api) =>
	(60 * 60) / ((api.consts.babe.expectedBlockTime.toJSON() as number) / 1000);
