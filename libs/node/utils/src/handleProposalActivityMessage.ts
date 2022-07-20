import { Api } from "@cennznet/api";
import chalk from "chalk";
import { Mongoose } from "mongoose";

import {
	fetchProposalStatus,
	fetchProposalVetoPercentage,
	fetchProposalVotes,
} from "@app-gov/service/cennznet";
import { DiscordWebhooks, getDiscordMessage } from "@app-gov/service/discord";
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
				const { passVotes, rejectVotes } = await fetchProposalVotes(
					api,
					proposalId
				);

				if (
					proposal.passVotes === passVotes &&
					proposal.rejectVotes === rejectVotes
				)
					break;

				logger.info("Proposal #%d: 🗳  update votes [1/3]", proposalId);
				updatedData = { ...updatedData, passVotes, rejectVotes };
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

		const discordMessage = getDiscordMessage(proposalId, proposal);

		let discordProposalMessage = "",
			discordReferendumMessage = "";

		switch (status) {
			case "Deliberation": {
				if (!proposal.discordProposalMessage) {
					const { id } = await proposalWebhook.send(discordMessage);
					discordProposalMessage = id;
					break;
				}

				await proposalWebhook.editMessage(
					proposal.discordProposalMessage,
					discordMessage
				);

				logger.info(
					`[${chalk.magenta("Discord")}] Proposal #%d: 🗳  update votes [2/3]`,
					proposalId
				);
				break;
			}

			case "ReferendumDeliberation": {
				if (!proposal.discordReferendumMessage) {
					const { id } = await referendumWebhook.send(discordMessage);
					discordReferendumMessage = id;
					break;
				}

				await referendumWebhook.editMessage(
					proposal.discordReferendumMessage,
					discordMessage
				);

				logger.info(
					`[${chalk.magenta("Discord")}] Proposal #%d: 🗳  update veto [2/3]`,
					proposalId
				);
				break;
			}

			default: {
				if (proposal.discordProposalMessage)
					await proposalWebhook.editMessage(
						proposal.discordProposalMessage,
						discordMessage
					);

				if (proposal.discordReferendumMessage)
					await referendumWebhook.editMessage(
						proposal.discordReferendumMessage,
						discordMessage
					);

				logger.info(
					`[${chalk.magenta("Discord")}] Proposal #%d: 🗳  update status [2/3]`,
					proposalId
				);
				break;
			}
		}

		updatedData = {
			...updatedData,
			discordProposalMessage,
			discordReferendumMessage,
		};

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
