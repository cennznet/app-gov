import { Api } from "@cennznet/api";
import { Mongoose } from "mongoose";

import {
	fetchProposalStatus,
	fetchProposalVetoPercentage,
	fetchProposalVotes,
} from "@app-gov/service/cennznet";
import { MESSAGE_TIMEOUT } from "@app-gov/service/env-vars";
import { createModelUpdater, ProposalModel } from "@app-gov/service/mongodb";

import { getLogger, TimeoutError, waitForTime } from "./";

interface MessageBody {
	proposalId: number;
}

/**
 * Handle the proposal activity message
 *
 * @param {Api} api
 * @param {Mongoose} mdb
 * @param {MessageBody} body
 * @return {Promise<void>}
 */
export const handleProposalActivityMessage = async (
	api: Api,
	mdb: Mongoose,
	body: MessageBody
): Promise<void> => {
	const logger = getLogger("ProposalSub");
	const { proposalId } = body;
	const updateProposalRecord = createModelUpdater<ProposalModel>(
		mdb.model<ProposalModel>("Proposal"),
		{ proposalId }
	);
	const handleMessage = async () => {
		const proposal = await mdb
			.model<ProposalModel>("Proposal")
			.findOne({ proposalId });
		if (!proposal) return;

		const status = await fetchProposalStatus(api, proposalId);
		let updatedData = {};

		if (proposal.status !== status) updatedData = { status };

		switch (status) {
			case "Deliberation": {
				const { passVotes, rejectVotes } = await fetchProposalVotes(
					api,
					proposalId
				);

				if (
					proposal.passVotes === passVotes &&
					proposal.rejectVotes === rejectVotes
				)
					break;

				logger.info("Proposal #%d: 🗳  update votes [1/2]", proposalId);
				updatedData = { ...updatedData, passVotes, rejectVotes };
				break;
			}

			case "ReferendumDeliberation": {
				const vetoPercentage = await fetchProposalVetoPercentage(
					api,
					proposalId
				);

				if (proposal.vetoPercentage === vetoPercentage) break;
				logger.info("Proposal #%d: 🗳  update veto [1/2]", proposalId);
				updatedData = { ...updatedData, vetoPercentage };
				break;
			}
		}

		if (!Object.keys(updatedData).length) return;

		logger.info("Proposal #%d: 🗂  file to DB [2/2]", proposalId);
		await updateProposalRecord(updatedData);

		// TODO: Update details on Discord
	};

	const output = await Promise.race([
		waitForTime(MESSAGE_TIMEOUT),
		handleMessage(),
	]);

	if (output === "time-out") throw new TimeoutError(MESSAGE_TIMEOUT);
};
