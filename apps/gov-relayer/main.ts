require("dotenv").config({ path: `${__dirname}/.env` });

require("yargs")
	.scriptName("gov-relayer")
	.command(require("./commands/proposal-pub"))
	.help().argv;
