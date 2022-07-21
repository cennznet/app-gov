import type { ColorResolvable, EmbedFieldData } from "discord.js";
import { MessageEmbed } from "discord.js";

import type { ProposalModel } from "@app-gov/service/mongodb";

import { DiscordChannel, getVoteFields } from "./";

const COLOURS: Record<string, ColorResolvable> = {
	Pass: "#05b210",
	Vote: "#9847FF",
	Reject: "RED",
};

export const getProposalEmbed = (
	proposalId: number,
	channel: DiscordChannel,
	justification: string | void,
	proposalInfo: Partial<ProposalModel>
): MessageEmbed => {
	const status = proposalInfo.status;
	const proposalFields = getProposalFields(proposalInfo, justification);
	let messageEmbed: MessageEmbed | undefined;

	const withVoteFields = new MessageEmbed()
		.setColor(COLOURS.Vote)
		.setTitle(`Proposal ID: _#${proposalId}_`)
		.setFields(proposalFields)
		.addFields(getVoteFields(proposalInfo))
		.setFooter({ text: `Status: ${status}` })
		.setTimestamp();

	switch (status) {
		case "Deliberation": {
			messageEmbed = withVoteFields;
			break;
		}

		case "ReferendumDeliberation": {
			if (channel === "referendum") messageEmbed = withVoteFields;

			if (channel === "proposal")
				messageEmbed = new MessageEmbed()
					.setColor(COLOURS.Pass)
					.setTitle(`Proposal ID: _#${proposalId}_`)
					.setFields(proposalFields)
					.setFooter({ text: `Status: ${status}` })
					.setTimestamp();
			break;
		}

		default: {
			messageEmbed = new MessageEmbed()
				.setColor(status === "Disapproved" ? COLOURS.Reject : COLOURS.Pass)
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(proposalFields)
				.setFooter({ text: `Status: ${status}` })
				.setTimestamp();
			break;
		}
	}

	return messageEmbed as MessageEmbed;
};

export const getProposalFields = (
	proposalInfo: Partial<ProposalModel>,
	justification: string | void
): EmbedFieldData[] => {
	return justification
		? [
				{
					name: "Justification",
					value: justification,
				},
				{
					name: "Sponsor",
					value: `_${proposalInfo.sponsor}_`,
				},
				{
					name: "Enactment Delay",
					value: `${proposalInfo.enactmentDelay} blocks`,
				},
		  ]
		: [
				{
					name: "Sponsor",
					value: `_${proposalInfo.sponsor}_`,
				},
				{
					name: "Enactment Delay",
					value: `${proposalInfo.enactmentDelay} blocks`,
				},
		  ];
};
