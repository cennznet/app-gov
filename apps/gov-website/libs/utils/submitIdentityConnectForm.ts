import { Api } from "@cennznet/api";

interface ResponseBody {
	message?: string;
}

interface ConnectFormData {
	address: string;
	twitterUsername: string;
	discordUsername: string;
}

export async function submitIdentityConnectForm(
	api: Api,
	{ address, twitterUsername, discordUsername }: ConnectFormData
): Promise<void> {
	// const extrinsic =
	// const response = await fetch("/api/identity/connect", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify(Object.fromEntries(data.entries())),
	// });
	// const body = (await response.json()) as ResponseBody;
	// if (!response.ok) {
	// 	throw {
	// 		code: response.status,
	// 		message: body?.message ?? response.statusText,
	// 	};
	// }
	// return body;
}
