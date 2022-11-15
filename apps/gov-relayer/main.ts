/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config({ path: `${__dirname}/.env` });

require("yargs")
	.scriptName("gov-relayer")
	.command(require("./commands/proposal-patch"))
	.command(require("./commands/proposal-monitor"))
	.help().argv;
