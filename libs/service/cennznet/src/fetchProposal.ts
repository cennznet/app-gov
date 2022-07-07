/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Api } from "@cennznet/api";
import type { EraIndex, Permill, u128 } from "@cennznet/types";
import mongoose from "mongoose";

import { Proposal, Referendum } from "@app-gov/node/models";
import type { ProposalCall } from "@app-gov/node/types";
import { MONGODB_SERVER } from "@app-gov/service/constants";

export const fetchProposal = async (api: Api, proposalId: string) => {
	await connectMongoose();

	const proposalCall = await fetchProposalCall(api, proposalId);
	const proposal = await Proposal.findOne({ proposalId });

	const proposalStringified = JSON.stringify(proposal);
	const referendum = await fetchReferendum(api, proposal, proposalId);

	return {
		proposalId,
		proposalCall,
		proposal: JSON.parse(proposalStringified),
		referendum: referendum ?? {},
	};
};

const connectMongoose = async (): Promise<void> => {
	if (mongoose.connection.readyState >= 1) return;

	await mongoose.connect(MONGODB_SERVER);
};

const fetchReferendum = async (
	api: Api,
	proposal: any,
	proposalId: string
): Promise<{ vetoThreshold: number; vetoPercentage: string } | void> => {
	if (proposal?.get("status") !== "ReferendumDeliberation") return;

	const referendum = await Referendum.findOne({ proposalId });
	const vetoSum = referendum?.get("vetoSum");
	const vetoThreshold = await fetchVetoThreshold(api);
	const vetoPercentage = await fetchVetoPercentage(api, vetoSum);

	return { vetoThreshold, vetoPercentage };
};

const fetchProposalCall = async (
	api: Api,
	proposalId: string
): Promise<ProposalCall> => {
	try {
		const extrinsicHash = (
			await api.query.governance.proposalCalls(proposalId)
		).toString();

		const { section, method, args } = api
			.createType("Call", extrinsicHash)
			.toHuman() as unknown as ProposalCall;

		return { section, method, args };
	} catch (error: any) {
		console.info(error.message);

		return {
			section: "undefined",
			method: "",
			args: {},
		};
	}
};

const fetchVetoThreshold = async (api: Api): Promise<number> => {
	const referendumThreshold = (
		(await api.query.governance.referendumThreshold()) as Permill
	).toNumber();

	return referendumThreshold / 10000;
};

const fetchVetoPercentage = async (
	api: Api,
	vetoSum: number
): Promise<string> => {
	const stakingEra = (
		(await api.query.staking.currentEra()) as EraIndex
	).toJSON();

	const totalStaked = (
		(await api.query.staking.erasTotalStake(stakingEra)) as u128
	).toNumber();

	return (vetoSum / totalStaked).toFixed();
};
