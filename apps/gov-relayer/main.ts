/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config({ path: `${__dirname}/.env` });

require("yargs")
	.scriptName("gov-relayer")
	.command(require("./commands/proposal-pub"))
	.command(require("./commands/proposal-sub"))
	.command(require("./commands/proposal-patch"))
	.help().argv;
