import { Api } from "@cennznet/api";
import { Mongoose } from "mongoose";

import {
	fetchProposalInfo,
	revalidateProposalRoute,
} from "@app-gov/service/cennznet";
import { MESSAGE_TIMEOUT } from "@app-gov/service/env-vars";
import { REVALIDATE_SECRET } from "@app-gov/service/env-vars";
import { createModelUpdater, ProposalModel } from "@app-gov/service/mongodb";

import { getLogger, TimeoutError, waitForTime } from "./";

interface MessageBody {
	proposalId: number;
}

/**
 * Handle the new proposal message
 *
 * @param {Api} api
 * @param {Mongoose} mdb
 * @param {MessageBody} body
 * @return {Promise<void>}
 */
export const handleNewProposalMessage = async (
	api: Api,
	mdb: Mongoose,
	body: MessageBody
): Promise<void> => {
	const logger = getLogger("ProposalMonitor");
	const { proposalId } = body;
	const updateProposalRecord = createModelUpdater<ProposalModel>(
		mdb.model<ProposalModel>("Proposal"),
		{ proposalId }
	);
	const handleMessage = async () => {
		// Create a record in the `proposals` collection to ack that it has been processed
		await updateProposalRecord({
			proposalId,
		});

		logger.info("Proposal #%d: 🎾 fetch info [1/2]", proposalId);
		const proposalInfo = await fetchProposalInfo(api, proposalId);
		if (!proposalInfo) return;

		logger.info("Proposal #%d: 🗂 file to DB [2/2]", proposalId);
		await updateProposalRecord({
			proposalId,
			...proposalInfo,
		});

		logger.info("Proposal #%d: revalidate proposal route done", proposalId);
		const { revalidated } = await revalidateProposalRoute(
			proposalId,
			REVALIDATE_SECRET
		);
		if (!revalidated)
			logger.warn("Unable to revalidate proposal #%d", proposalId);
	};

	const output = await Promise.race([
		waitForTime(MESSAGE_TIMEOUT),
		handleMessage(),
	]);

	if (output === "time-out") throw new TimeoutError(MESSAGE_TIMEOUT);
};
