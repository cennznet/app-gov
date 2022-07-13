require("yargs")
	.scriptName("gov-relayer")
	.command(require("./commands/proposal-subscriber"))
	.help().argv;
