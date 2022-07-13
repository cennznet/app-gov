import { AMQPError } from "@cloudamqp/amqp-client";
import chalk from "chalk";

import { getLogger } from "@app-gov/node/utils";

import { CENNZ_NETWORK } from "../constants";

module.exports = {
	command: "proposal-sub",
	desc: "Start a [ProposalSub] process",
	handler() {
		const logger = getLogger("ProposalSub");
		logger.info(
			`Start process on ${chalk.magenta("%s")}...`,
			CENNZ_NETWORK.chainTitle
		);

		try {
		} catch (error) {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		}
	},
};
