import mongoose, { Schema } from "mongoose";

import type { ProposalModel } from "./types";

!mongoose.models["Proposal"] &&
	mongoose.model(
		"Proposal",
		new Schema<ProposalModel>({
			proposalId: { type: Schema.Types.Number, required: true, unique: true },
			sponsor: { type: Schema.Types.String },
			justificationUri: { type: Schema.Types.String },
			enactmentDelay: { type: Schema.Types.Number },
			call: { type: Schema.Types.Map },
			status: { type: Schema.Types.String },
			passVotes: { type: Schema.Types.Number },
			rejectVotes: { type: Schema.Types.Number },
			vetoPercentage: { type: Schema.Types.Number },
			discordProposalMessage: { type: Schema.Types.String },
			discordReferendumMessage: { type: Schema.Types.String },
		})
	);
