import { AMQPClient } from "@cloudamqp/amqp-client";

let client: AMQPClient;

export const getAMQClient = async (serverUri: string): Promise<AMQPClient> => {
	if (client) return client;
	client = new AMQPClient(serverUri);
	await client.connect();
	return client;
};
