import type { MessageActionRow, MessageEmbed } from "discord.js";

import type { ProposalModel } from "@app-gov/service/mongodb";

import { getProposalEmbed, getVoteButtons } from "./";

interface DiscordMessage {
	components: MessageActionRow[];
	embeds: MessageEmbed[];
}

export function getDiscordMessage(
	proposalId: number,
	proposalInfo: ProposalModel
): DiscordMessage {
	return {
		components: [
			getVoteButtons(proposalId, proposalInfo.status) as MessageActionRow,
		],
		embeds: [getProposalEmbed(proposalId, proposalInfo)],
	};
}
