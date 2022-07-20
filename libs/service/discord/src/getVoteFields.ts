import { EmbedFieldData, MessageActionRow, MessageButton } from "discord.js";

import { PROPOSAL_URL } from "@app-gov/service/env-vars";
import type { ProposalModel } from "@app-gov/service/mongodb";

export const getVoteFields = ({
	status,
	votePercentage,
	vetoPercentage,
}: Partial<ProposalModel>): EmbedFieldData[] =>
	status === "Deliberation"
		? [
				{
					name: "Threshold to Pass",
					value: `Current: _${votePercentage}%_ / Required: _50%_`,
					inline: false,
				},
		  ]
		: [
				{
					name: "Threshold to Veto",
					value: `Current: _${vetoPercentage}%_ / Required: _33%_`,
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
