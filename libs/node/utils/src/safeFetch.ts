type FetchParams = Parameters<typeof fetch>;

export const safeFetch = async (...args: FetchParams) => {
	const response = await fetch(...args);

	if (!response.ok) throw new HttpError(response);

	return response;
};

export class HttpError extends Error {
	status: number;
	statusText: string;
	code: string;
	response: Response;

	constructor(response: Response) {
		super(`HTTP/${response.status} ${response.statusText} - ${response.url}`);
		Object.setPrototypeOf(this, HttpError.prototype);
		this.response = response;
		this.status = response.status;
		this.statusText = response.statusText;
		this.code = `HTTP/${response.status}`;
	}
}
