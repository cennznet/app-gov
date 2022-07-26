import { useRouter } from "next/router";
import { useCallback } from "react";

import { fetchProposalStatus } from "@app-gov/service/cennznet";
import { useCENNZApi } from "@app-gov/web/providers";

interface UseRedirectHook {
	redirectOnDisapproval: (proposalId: number) => Promise<void>;
}

export const useRedirect = (): UseRedirectHook => {
	const { api } = useCENNZApi();
	const { replace } = useRouter();

	const redirectOnDisapproval = useCallback(
		async (proposalId: number): Promise<void> => {
			if (!api) return;

			const proposalStatus = await fetchProposalStatus(api, proposalId);

			if (proposalStatus === "Disapproved") replace("/proposal/new");
		},
		[api, replace]
	);

	return {
		redirectOnDisapproval,
	};
};
