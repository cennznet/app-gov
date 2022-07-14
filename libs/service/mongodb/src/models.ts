import mongoose, { Model, Schema } from "mongoose";

import type { ProposalModel } from "./types";

export const Proposal: Model<ProposalModel> = mongoose.model(
	"Proposal",
	new Schema<ProposalModel>({
		proposalId: { type: Schema.Types.Number, required: true, unique: true },
		sponsor: { type: Schema.Types.String },
		justificationUri: { type: Schema.Types.String },
		enactmentDelay: { type: Schema.Types.Number },
		call: { type: Schema.Types.Map },
	})
);
