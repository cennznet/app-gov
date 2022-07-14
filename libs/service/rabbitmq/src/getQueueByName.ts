import { AMQPClient, AMQPQueue } from "@cloudamqp/amqp-client";

type QueueType = "Producer" | "Consumer";

export const getQueueByName = async (
	client: AMQPClient,
	type: QueueType,
	name: string
): Promise<AMQPQueue> => {
	const channel = await client.channel();
	if (type === "Consumer") await channel.prefetch(5);
	return await channel.queue(name, {
		durable: true,
	});
};
