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

	const title = `Proposal ID: _#${proposalId}_`;
	const footer = { text: `Status: ${status}` };

	const withVoteFields = new MessageEmbed()
		.setColor(COLOURS.Vote)
		.setTitle(title)
		.setFields(proposalFields)
		.addFields(getVoteFields(proposalInfo))
		.setFooter(footer)
		.setTimestamp();

	let messageEmbed: MessageEmbed | undefined;
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
					.setTitle(title)
					.setFields(proposalFields)
					.setFooter(footer)
					.setTimestamp();
			break;
		}

		default: {
			messageEmbed = new MessageEmbed()
				.setColor(status === "Disapproved" ? COLOURS.Reject : COLOURS.Pass)
				.setTitle(title)
				.setFields(proposalFields)
				.setFooter(footer)
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
