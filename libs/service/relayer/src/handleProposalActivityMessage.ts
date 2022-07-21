import { Api } from "@cennznet/api";
import { Mongoose } from "mongoose";

import { resolveProposalJustification } from "@app-gov/node/utils";
import {
	fetchProposalStatus,
	fetchProposalVetoPercentage,
	fetchProposalVotePercentage,
	fetchProposalVotes,
} from "@app-gov/service/cennznet";
import { DiscordWebhooks, getDiscordUpdate } from "@app-gov/service/discord";
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
 * @param {DiscordWebhooks} discordWebhooks
 * @param {Mongoose} mdb
 * @param {MessageBody} body
 * @return {Promise<void>}
 */
export const handleProposalActivityMessage = async (
	api: Api,
	[proposalWebhook, referendumWebhook]: DiscordWebhooks,
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
				logger.info("Proposal #%d: 🗳  update votes [1/3]", proposalId);
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

				updatedData = { ...updatedData, ...votes, votePercentage };
				break;
			}

			case "ReferendumDeliberation": {
				logger.info("Proposal #%d: 🗳  update veto [1/3]", proposalId);
				const vetoPercentage = await fetchProposalVetoPercentage(
					api,
					proposalId
				);

				if (proposal.vetoPercentage === vetoPercentage) break;

				updatedData = { ...updatedData, vetoPercentage };
				break;
			}
		}

		if (!Object.keys(updatedData).length) return;
		logger.info("Proposal #%d: 💬  update Discord [2/3]", proposalId);

		const proposalJustification = await resolveProposalJustification(
			proposal.justificationUri ?? ""
		);
		const discordProposalUpdate = getDiscordUpdate(
			proposalId,
			"proposal",
			proposalJustification,
			{
				status,
				sponsor: proposal.sponsor,
				votePercentage: proposal.votePercentage,
				enactmentDelay: proposal.enactmentDelay,
				...updatedData,
			}
		);
		const discordReferendumUpdate = getDiscordUpdate(
			proposalId,
			"referendum",
			proposalJustification,
			{
				status,
				sponsor: proposal.sponsor,
				vetoPercentage: proposal.vetoPercentage,
				enactmentDelay: proposal.enactmentDelay,
				...updatedData,
			}
		);

		let discordProposalMessage: string | undefined,
			discordReferendumMessage: string | undefined;

		switch (status) {
			case "Deliberation":
				if (!proposal.discordProposalMessage) {
					const { id } = await proposalWebhook.send(discordProposalUpdate);
					discordProposalMessage = id;
				}
				break;
			case "ReferendumDeliberation": {
				if (!proposal.discordReferendumMessage) {
					const { id } = await referendumWebhook.send(discordReferendumUpdate);
					discordReferendumMessage = id;
				}
				break;
			}
		}

		if (!discordProposalMessage && proposal.discordProposalMessage)
			await proposalWebhook.editMessage(
				proposal.discordProposalMessage,
				discordProposalUpdate
			);
		if (!discordReferendumMessage && proposal.discordReferendumMessage)
			await referendumWebhook.editMessage(
				proposal.discordReferendumMessage,
				discordReferendumUpdate
			);

		updatedData = {
			...updatedData,
			discordProposalMessage,
			discordReferendumMessage,
		};

		logger.info("Proposal #%d: 🗂  file to DB [3/3]", proposalId);
		await updateProposalRecord(updatedData);
	};

	const output = await Promise.race([
		waitForTime(MESSAGE_TIMEOUT),
		handleMessage(),
	]);

	if (output === "time-out") throw new TimeoutError(MESSAGE_TIMEOUT);
};
