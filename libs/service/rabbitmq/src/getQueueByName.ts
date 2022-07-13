import { CENNZNetNetwork } from "@cennznet/api/types";
import { AMQPClient, AMQPQueue } from "@cloudamqp/amqp-client";

type QueueName = "ProposalQueue";

export const getQueueByName = async (
	client: AMQPClient,
	networkName: CENNZNetNetwork,
	appName: string,
	name: QueueName
): Promise<AMQPQueue> => {
	const channel = await client.channel();
	await channel.prefetch(1);
	return await channel.queue(`${networkName}_${appName}_${name}`, {
		durable: true,
	});
};
