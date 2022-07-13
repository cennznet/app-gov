import mongoose, { Mongoose } from "mongoose";

let client: Mongoose | undefined;
export const getMDBClient = async (serverUri: string): Promise<Mongoose> => {
	if (client) return client;
	return (client = await mongoose.connect(serverUri));
};
