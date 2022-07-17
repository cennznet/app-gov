import mongoose, { Mongoose } from "mongoose";

let client: Mongoose | undefined;
export const getMongoClient = async (serverUri: string): Promise<Mongoose> => {
	if (client) return client;
	return (client = await mongoose.connect(serverUri));
};
