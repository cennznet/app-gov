import { EmbedFieldData, MessageActionRow, MessageButton } from "discord.js";

import { PROPOSAL_URL } from "@app-gov/service/env-vars";
import type { ProposalModel } from "@app-gov/service/mongodb";

import { DiscordChannel } from "./";

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
					value: `Current: _${vetoPercentage?.toFixed(2)}%_ / Required: _33%_`,
					inline: false,
				},
		  ];

type VoteButton = MessageActionRow | undefined;

export const getVoteButton = (
	proposalId: number,
	channel: DiscordChannel,
	proposalStatus: ProposalModel["status"]
): VoteButton => {
	let voteButton: VoteButton;

	switch (proposalStatus) {
		case "Deliberation":
			voteButton = new MessageActionRow().addComponents(
				new MessageButton()
					.setURL(`${PROPOSAL_URL}/${proposalId}`)
					.setLabel("Vote!")
					.setStyle("LINK")
			);
			break;

		case "ReferendumDeliberation":
			if (channel === "referendum")
				voteButton = new MessageActionRow().addComponents(
					new MessageButton()
						.setURL(`${PROPOSAL_URL}/${proposalId}`)
						.setLabel("Veto!")
						.setStyle("LINK")
				);
			break;
	}

	return voteButton;
};
