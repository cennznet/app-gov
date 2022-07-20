import type { MessageActionRow, MessageEmbed } from "discord.js";

import type { ProposalModel } from "@app-gov/service/mongodb";

import { getProposalEmbed, getVoteButtons } from "./";

interface DiscordMessage {
	components: MessageActionRow[];
	embeds: MessageEmbed[];
}

export const getDiscordMessage = async (
	proposalId: number,
	proposalInfo: ProposalModel
): Promise<DiscordMessage> => {
	return {
		components: [
			getVoteButtons(proposalId, proposalInfo.status) as MessageActionRow,
		],
		embeds: [await getProposalEmbed(proposalId, proposalInfo)],
	};
};
