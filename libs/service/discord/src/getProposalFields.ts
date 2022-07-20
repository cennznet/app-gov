import type { EmbedFieldData } from "discord.js";
import { MessageEmbed } from "discord.js";

import { resolveProposalJustification } from "@app-gov/node/utils";
import type { ProposalModel } from "@app-gov/service/mongodb";

import { getVoteFields } from "./";

export const getProposalEmbed = async (
	proposalId: number,
	proposalInfo: ProposalModel
): Promise<MessageEmbed> =>
	proposalInfo.status?.includes("Deliberation")
		? new MessageEmbed()
				.setColor("#9847FF")
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(await getProposalFields(proposalInfo))
				.addFields(getVoteFields(proposalInfo))
				.setFooter({ text: `Status: ${proposalInfo.status}` })
				.setTimestamp()
		: new MessageEmbed()
				.setColor(proposalInfo.status === "Disapproved" ? "RED" : "#05b210")
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(await getProposalFields(proposalInfo))
				.setFooter({ text: `Status: ${proposalInfo.status}` })
				.setTimestamp();

export const getProposalFields = async (
	proposalInfo: ProposalModel
): Promise<EmbedFieldData[]> => [
	{
		name: "Details",
		value: await resolveProposalJustification(
			proposalInfo.justificationUri ?? ""
		),
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
