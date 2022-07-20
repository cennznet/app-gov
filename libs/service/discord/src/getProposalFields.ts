import type { ColorResolvable, EmbedFieldData } from "discord.js";
import { MessageEmbed } from "discord.js";

import { resolveProposalJustification } from "@app-gov/node/utils";
import type { ProposalModel } from "@app-gov/service/mongodb";

import { getVoteFields } from "./";

const COLOURS: Record<string, ColorResolvable> = {
	Pass: "#05b210",
	Vote: "#9847FF",
	Reject: "RED",
};

export const getProposalEmbed = async (
	proposalId: number,
	proposalInfo: ProposalModel
): Promise<MessageEmbed> => {
	const status = proposalInfo.status;
	const proposalFields = await getProposalFields(proposalInfo);

	return proposalInfo.status?.includes("Deliberation")
		? new MessageEmbed()
				.setColor(COLOURS.Vote)
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(proposalFields)
				.addFields(getVoteFields(proposalInfo))
				.setFooter({ text: `Status: ${status}` })
				.setTimestamp()
		: new MessageEmbed()
				.setColor(status === "Disapproved" ? COLOURS.Reject : COLOURS.Pass)
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setFields(proposalFields)
				.setFooter({ text: `Status: ${status}` })
				.setTimestamp();
};

export const getProposalFields = async (
	proposalInfo: ProposalModel
): Promise<EmbedFieldData[]> => {
	const proposalDetails = await resolveProposalJustification(
		proposalInfo.justificationUri ?? ""
	);

	if (proposalDetails)
		return [
			{
				name: "Details",
				value: proposalDetails ?? "",
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

	return [
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
