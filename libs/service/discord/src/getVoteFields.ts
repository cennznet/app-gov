import { EmbedFieldData, MessageActionRow, MessageButton } from "discord.js";

import { PROPOSAL_URL } from "@app-gov/service/env-vars";
import type { ProposalModel } from "@app-gov/service/mongodb";

export const getVoteFields = ({
	passVotes,
	rejectVotes,
}: ProposalModel): EmbedFieldData[] => [
	{
		name: "Votes to Pass",
		value: `_**${passVotes}**_`,
		inline: true,
	},
	{
		name: "Votes to Reject",
		value: `_**${rejectVotes}**_`,
		inline: true,
	},
];

export const getVoteButtons = (proposalId: number): MessageActionRow =>
	new MessageActionRow().addComponents(
		new MessageButton()
			.setURL(`${PROPOSAL_URL}/${proposalId}`)
			.setLabel("Vote!")
			.setStyle("LINK")
	);
