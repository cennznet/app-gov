import { Api } from "@cennznet/api";

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
		.filter((name): number => Object.keys(api.tx[name]).length);

	const extrinsics = sections.reduce((extrinsics, section) => {
		const methods = Object.keys(api.tx[section]);
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

			if (!args.length) return methods;

			methods[method] = args;

			return methods;
		}, {} as Extrinsic);

		return extrinsics;
	}, {} as CallableExtrinsics);

	return extrinsics;
};
