import type { MessageActionRow, MessageEmbed } from "discord.js";

import type { ProposalModel } from "@app-gov/service/mongodb";

import { getProposalEmbed, getVoteButton } from "./";

export interface DiscordUpdate {
	components?: MessageActionRow[];
	embeds: MessageEmbed[];
}

export type DiscordChannel = "proposal" | "referendum";

export const getDiscordUpdate = (
	proposalId: number,
	channel: DiscordChannel,
	justification: string | void,
	proposalInfo: Partial<ProposalModel>
): DiscordUpdate => {
	const voteButton = getVoteButton(proposalId, channel, proposalInfo.status);

	return {
		...(voteButton && { components: [voteButton] }),
		embeds: [
			getProposalEmbed(proposalId, channel, justification, proposalInfo),
		],
	};
};
