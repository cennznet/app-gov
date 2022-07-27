import { AMQPMessage, AMQPQueue } from "@cloudamqp/amqp-client";

type ResponseStatus = "📨 requeued" | "📩 discarded";

export async function requeueMessage(
	queue: AMQPQueue,
	message: AMQPMessage,
	maxRetry: number
): Promise<ResponseStatus> {
	const retriesCount = Number(message?.properties?.headers?.["x-retries"] ?? 0);
	if (retriesCount >= maxRetry) return "📩 discarded";

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	await queue.publish(message.body!, {
		...message.properties,
		headers: {
			...message.properties.headers,
			"x-retries": retriesCount + 1,
		},
	});

	return "📨 requeued";
}
