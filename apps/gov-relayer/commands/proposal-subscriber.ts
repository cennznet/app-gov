module.exports = {
	command: "proposal-subscriber",
	desc: "Start a ProposalSubscriber process",
	handler(argv) {
		const type: string[] = ["foo", "baz"];
		console.log("hello", type.join(" "));
	},
};
