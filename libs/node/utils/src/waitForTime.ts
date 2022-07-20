export const waitForTime = async (
	duration: number,
	returnValue = "time-out"
): Promise<string> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(returnValue), duration);
	});
};
