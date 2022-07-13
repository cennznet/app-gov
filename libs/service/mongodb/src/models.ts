import mongoose, { Model, Schema } from "mongoose";

import type { ProposalModel } from "./types";

const ProposalSchema = new Schema<ProposalModel>({
	id: { type: Schema.Types.Number, required: true, unique: true },
	sponsor: { type: Schema.Types.String },
	justificationUri: { type: Schema.Types.String },
	enactmentDelay: { type: Schema.Types.Number },
	call: { type: Schema.Types.String },
});

export const Proposal: Model<ProposalModel> = mongoose.model(
	"Proposal",
	ProposalSchema
);
