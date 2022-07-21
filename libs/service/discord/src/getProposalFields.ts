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
	enactmentDelayInHours: number,
	proposalInfo: Partial<ProposalModel>
): MessageEmbed => {
	const status = proposalInfo.status;
	const proposalFields = getProposalFields(
		proposalInfo,
		justification,
		enactmentDelayInHours
	);

	const baseMessage = new MessageEmbed()
		.setTitle(`Proposal ID: _#${proposalId}_`)
		.setFields(proposalFields)
		.setFooter({ text: `Status: ${status}` })
		.setTimestamp();

	let messageEmbed: MessageEmbed | undefined;
	switch (status) {
		case "Deliberation": {
			messageEmbed = baseMessage
				.setColor(COLOURS.Vote)
				.addFields(getVoteFields(proposalInfo));
			break;
		}

		case "ReferendumDeliberation": {
			if (channel === "referendum")
				messageEmbed = baseMessage
					.setColor(COLOURS.Vote)
					.addFields(getVoteFields(proposalInfo));

			if (channel === "proposal")
				messageEmbed = baseMessage.setColor(COLOURS.Pass);
			break;
		}

		default: {
			messageEmbed = baseMessage.setColor(
				status === "Disapproved" ? COLOURS.Reject : COLOURS.Pass
			);
			break;
		}
	}

	return messageEmbed as MessageEmbed;
};

export const getProposalFields = (
	proposalInfo: Partial<ProposalModel>,
	justification: string | void,
	enactmentDelayInHours: number
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
					value: `_${proposalInfo.enactmentDelay}_ blocks / _${enactmentDelayInHours}_ hours`,
				},
		  ];
};
