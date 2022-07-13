import { CENNZNetNetwork } from "@cennznet/api/types";

import { getNetworkDetails, NetworkDetails } from "@app-gov/service/cennznet";

export const MONGODB_URI: string =
	process.env.MONGODB_URI ?? "mongodb://root:root@localhost:27017/admin";
export const RABBITMQ_URI: string =
	process.env.RABBITMQ_URI ?? "amqp://guest:guest@localhost:5672";
export const CENNZ_NETWORK: NetworkDetails = getNetworkDetails(
	(process.env.CENNZ_NETWORK ?? "rata") as CENNZNetNetwork
);
export const BLOCK_POLLING_INTERVAL = Number(
	process.env.BLOCK_POLLING_INTERVAL || 2
);
