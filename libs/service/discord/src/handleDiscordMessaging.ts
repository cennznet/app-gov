import { Api } from "@cennznet/api";
import { InteractionWebhook } from "discord.js";
import { Logger } from "winston";

import {
	getHourInBlocks,
	resolveProposalJustification,
} from "@app-gov/node/utils";
import { ProposalModel } from "@app-gov/service/mongodb";

import { getDiscordUpdate } from "./";

export const handleDiscordMessaging = async (
	api: Api,
	logger: Logger,
	proposal: ProposalModel,
	[proposalWebhook, referendumWebhook]: InteractionWebhook[],
	proposalId: number,
	status: ProposalModel["status"],
	updatedData: Partial<ProposalModel>
): Promise<Partial<ProposalModel>> => {
	if (!proposal.enactmentDelay || !proposal.justificationUri)
		return updatedData;

	const proposalJustification = await resolveProposalJustification(
		proposal.justificationUri
	);
	const enactmentDelayInHours = proposal.enactmentDelay / getHourInBlocks(api);

	const proposalInfo = {
		status,
		sponsor: proposal.sponsor,
		enactmentDelay: proposal.enactmentDelay,
		...updatedData,
	};

	const discordProposalUpdate = getDiscordUpdate(
		proposalId,
		"proposal",
		proposalJustification,
		enactmentDelayInHours,
		proposalInfo
	);
	const discordReferendumUpdate = getDiscordUpdate(
		proposalId,
		"referendum",
		proposalJustification,
		enactmentDelayInHours,
		proposalInfo
	);

	logger.debug(
		"proposal %d: checking for discordProposalMessage",
		proposalId,
		proposal?.discordProposalMessage
	);
	let discordProposalMessage: string | undefined,
		discordReferendumMessage: string | undefined;

	switch (status) {
		case "Deliberation":
			if (!proposal.discordProposalMessage)
				discordProposalMessage = (
					await proposalWebhook.send(discordProposalUpdate)
				).id;
			break;
		case "ReferendumDeliberation": {
			if (!proposal.discordReferendumMessage)
				discordReferendumMessage = (
					await referendumWebhook.send(discordReferendumUpdate)
				).id;
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

	logger.debug(
		"proposal %d: discordProposalMessage after send/edit - %s",
		proposalId,
		discordProposalMessage
	);

	return {
		...updatedData,
		discordProposalMessage,
		discordReferendumMessage,
	};
};
