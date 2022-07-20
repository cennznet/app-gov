export class TimeoutError extends Error {
	constructor(duration: number) {
		super(`Timeout ${duration}ms`);
		Object.setPrototypeOf(this, TimeoutError.prototype);
	}
}
