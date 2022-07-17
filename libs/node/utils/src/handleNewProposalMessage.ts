import { Api } from "@cennznet/api";
import { Mongoose } from "mongoose";

import { fetchProposalInfo } from "@app-gov/service/cennznet";
import { createModelUpdater, ProposalModel } from "@app-gov/service/mongodb";

import { AbortError, getLogger } from "./";

interface MessageBody {
	messageId: string;
	proposalId: number;
}

/**
 * Handle the new proposal message
 *
 * @param {Api} api
 * @param {Mongoose} mdb
 * @param {MessageBody} body
 * @param {AbortSignal} abortSignal
 * @return {Promise<void>}
 */
export const handleNewProposalMessage = async (
	api: Api,
	mdb: Mongoose,
	body: MessageBody,
	abortSignal: AbortSignal
): Promise<void> => {
	const logger = getLogger("ProposalSub");
	const { proposalId } = body;

	return new Promise((resolve, reject) => {
		let processed = false;

		abortSignal.addEventListener("abort", () => {
			if (processed) return;
			logger.info("Proposal #%d: 🛑 aborted", proposalId);
			reject(new AbortError());
		});

		const updateProposalRecord = createModelUpdater<ProposalModel>(
			mdb.model<ProposalModel>("Proposal"),
			{ proposalId }
		);

		if (abortSignal.aborted) return;
		logger.info("Proposal #%d: 🎾 fetch info [1/3]", proposalId);
		fetchProposalInfo(api, proposalId)
			.then((proposalInfo) => {
				if (abortSignal.aborted) return;
				if (!proposalInfo) return true;
				logger.info("Proposal #%d: 📮 file to DB [2/3]", proposalId);
				return updateProposalRecord({
					proposalId,
					...proposalInfo,
				}).then(() => true);
			})
			.then((success) => {
				if (!success) return;
				logger.info("Proposal #%d: 💌 post on Discord [3/3]", proposalId);
				// TODO: publishOnDiscord
				return success;
			})
			.then((success) => {
				processed = success as boolean;
				if (!success) return;
				logger.info("Proposal #%d: 🎉 complete", proposalId);
				resolve();
			})
			.catch((error) => {
				processed = true;
				reject(error);
			});
	});
};
