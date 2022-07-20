import { EmbedFieldData, MessageActionRow, MessageButton } from "discord.js";

import { PROPOSAL_URL } from "@app-gov/service/env-vars";
import type { ProposalModel } from "@app-gov/service/mongodb";

export const getVoteFields = ({
	passVotes,
	rejectVotes,
	status,
	vetoPercentage,
}: Partial<ProposalModel>): EmbedFieldData[] =>
	status === "Deliberation"
		? [
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
		  ]
		: [
				{
					name: "Veto Sum",
					value: `_**${vetoPercentage} / 33 %**_`,
					inline: false,
				},
		  ];

type VoteButtons = MessageActionRow | undefined;

export const getVoteButtons = (
	proposalId: number,
	proposalStatus: ProposalModel["status"]
): VoteButtons => {
	let voteButtons: VoteButtons;

	switch (proposalStatus) {
		case "Deliberation":
			voteButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setURL(`${PROPOSAL_URL}/${proposalId}`)
					.setLabel("Vote!")
					.setStyle("LINK")
			);
			break;

		case "ReferendumDeliberation":
			voteButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setURL(`${PROPOSAL_URL}/${proposalId}`)
					.setLabel("Veto!")
					.setStyle("LINK")
			);
			break;

		default:
			break;
	}

	return voteButtons;
};
