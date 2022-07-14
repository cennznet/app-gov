require("dotenv").config({ path: `${__dirname}/.env` });

require("yargs")
	.scriptName("gov-relayer")
	.command(require("./commands/proposal-pub"))
	.command(require("./commands/proposal-sub"))
	.help().argv;
