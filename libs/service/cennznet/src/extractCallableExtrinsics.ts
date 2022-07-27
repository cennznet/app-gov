import { Api } from "@cennznet/api";

import { ALLOWED_EXTRINSICS } from "./";

export interface ExtrinsicArg {
	name: string;
	type: string;
}

interface Extrinsic {
	[method: string]: ExtrinsicArg[];
}

interface CallableExtrinsics {
	[section: string]: Extrinsic;
}

export const extractCallableExtrinsics = async (
	api: Api
): Promise<CallableExtrinsics> => {
	const sections = Object.keys(api.tx)
		.sort()
		.filter((name) => ALLOWED_EXTRINSICS.Sections.includes(name));

	const extrinsics = sections.reduce((extrinsics, section) => {
		const methods = Object.keys(api.tx[section]).filter((name: string) =>
			ALLOWED_EXTRINSICS.Methods[section].includes(name)
		);
		if (!methods.length) return extrinsics;

		extrinsics[section] = methods.reduce((methods, method) => {
			const args = api.tx[section][method].meta.args
				.map((arg) => {
					const name = arg.get("name")?.toString();
					const type = arg.get("typeName")?.toString();

					if (!name || !type) return;

					return { name, type };
				})
				.filter(Boolean) as { name: string; type: string }[];

			methods[method] = args ?? [];

			return methods;
		}, {} as Extrinsic);

		return extrinsics;
	}, {} as CallableExtrinsics);

	return extrinsics;
};
