export class AbortError extends Error {
	constructor() {
		super("Aborted");
		Object.setPrototypeOf(this, AbortError.prototype);
	}
}
