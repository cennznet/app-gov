import type { EmbedFieldData } from "discord.js";
import { MessageEmbed } from "discord.js";

import type { ProposalModel } from "@app-gov/service/mongodb";

import { getVoteFields } from "./";

export const getProposalEmbed = (
	proposalId: number,
	proposalInfo: ProposalModel
): MessageEmbed =>
	proposalInfo.status?.includes("Deliberation")
		? new MessageEmbed()
				.setColor("#9847FF")
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(getProposalFields(proposalInfo))
				.addFields(getVoteFields(proposalInfo))
				.setFooter({ text: `Status: ${proposalInfo.status}` })
				.setTimestamp()
		: new MessageEmbed()
				.setColor(proposalInfo.status === "Disapproved" ? "RED" : "#05b210")
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(getProposalFields(proposalInfo))
				.setFooter({ text: `Status: ${proposalInfo.status}` })
				.setTimestamp();

export const getProposalFields = (
	proposalInfo: ProposalModel
): EmbedFieldData[] => [
	{
		name: "Details",
		value: `Justification details are published [here](${proposalInfo.justificationUri})`,
	},
	{
		name: "Sponsor",
		value: `_${proposalInfo.sponsor}_`,
	},
	{
		name: "Enactment Delay",
		value: `${proposalInfo.enactmentDelay} blocks`,
	},
];
