import { Model } from "mongoose";

export const createModelUpdater = <T>(model: Model<T>, filter: Partial<T>) => {
	return async (data: Partial<T>) =>
		model.findOneAndUpdate(filter, data, { upsert: true });
};
