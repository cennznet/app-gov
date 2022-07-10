import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

import { hasIdentityValue, IdentityHash } from "./hashIdentityValue";

export function getSetIdentityExtrinsic(
	api: Api,
	fields: Record<string, string>
): SubmittableExtrinsic<"promise"> {
	const info = Object.keys(fields).reduce((info, key) => {
		info[key] = hasIdentityValue(fields[key]);
		return info;
	}, {} as Record<string, IdentityHash>);

	return api.tx.identity.setIdentity(info);
}
