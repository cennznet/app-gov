import { Api } from "@cennznet/api";
import { InteractionWebhook } from "discord.js";
import { Mongoose } from "mongoose";

import {
	getHourInBlocks,
	resolveProposalJustification,
} from "@app-gov/node/utils";
import {
	fetchProposalStatus,
	fetchProposalVetoPercentage,
	fetchProposalVotePercentage,
	fetchProposalVotes,
} from "@app-gov/service/cennznet";
import { handleDiscordMessaging } from "@app-gov/service/discord";
import { MESSAGE_TIMEOUT } from "@app-gov/service/env-vars";
import { createModelUpdater, ProposalModel } from "@app-gov/service/mongodb";

import { getLogger, TimeoutError, waitForTime } from "./";

interface MessageBody {
	proposalId: number;
}

/**
 * Handle the proposal activity message
 *
 * @param {Api} api
 * @param {InteractionWebhook[]} webhooks
 * @param {Mongoose} mdb
 * @param {MessageBody} body
 * @return {Promise<void>}
 */
export const handleProposalActivityMessage = async (
	api: Api,
	webhooks: InteractionWebhook[],
	mdb: Mongoose,
	body: MessageBody
): Promise<void> => {
	const logger = getLogger("ProposalSub");
	const { proposalId } = body;
	const updateProposalRecord = createModelUpdater<ProposalModel>(
		mdb.model<ProposalModel>("Proposal"),
		{ proposalId }
	);
	const handleMessage = async () => {
		const proposal = await mdb
			.model<ProposalModel>("Proposal")
			.findOne({ proposalId });
		if (!proposal) return;

		const status = await fetchProposalStatus(api, proposalId);
		let updatedData = {} as Partial<ProposalModel>;

		if (proposal.status !== status) updatedData = { status };

		switch (status) {
			case "Deliberation": {
				const votes = await fetchProposalVotes(api, proposalId);
				const votePercentage = await fetchProposalVotePercentage(
					api,
					proposalId,
					votes
				);

				if (
					proposal.passVotes === votes.passVotes &&
					proposal.rejectVotes === votes.rejectVotes &&
					proposal.votePercentage === votePercentage
				)
					break;

				logger.info("Proposal #%d: 🗳  update votes [1/3]", proposalId);
				updatedData = { ...updatedData, ...votes, votePercentage };
				break;
			}

			case "ReferendumDeliberation": {
				const vetoPercentage = await fetchProposalVetoPercentage(
					api,
					proposalId
				);

				if (proposal.vetoPercentage === vetoPercentage) break;

				logger.info("Proposal #%d: 🗳  update veto [1/3]", proposalId);
				updatedData = { ...updatedData, vetoPercentage };
				break;
			}
		}

		if (!Object.keys(updatedData).length) return;
		logger.info("Proposal #%d: 💬 update Discord [2/3]", proposalId);
		updatedData = await handleDiscordMessaging(
			api,
			proposal,
			webhooks,
			proposalId,
			status,
			updatedData
		);

		if (!Object.keys(updatedData).length) return;
		logger.info("Proposal #%d: 🗂  file to DB [3/3]", proposalId);
		await updateProposalRecord(updatedData);
	};

	const output = await Promise.race([
		waitForTime(MESSAGE_TIMEOUT),
		handleMessage(),
	]);

	if (output === "time-out") throw new TimeoutError(MESSAGE_TIMEOUT);
};
