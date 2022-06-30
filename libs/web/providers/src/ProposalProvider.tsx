import type { PropsWithChildren } from "@app-gov/web/types";

import { FC, createContext, useContext } from "react";
import { TxStatusHook, useTxStatus } from "@app-gov/web/hooks";

interface ProposalContextType extends TxStatusHook {}

const ProposalContext = createContext<ProposalContextType>(
	{} as ProposalContextType
);

interface ProposalProviderProps extends PropsWithChildren {}

export const ProposalProvider: FC<ProposalProviderProps> = ({ children }) => {
	return (
		<ProposalContext.Provider
			value={{
				...useTxStatus(),
			}}
		>
			{children}
		</ProposalContext.Provider>
	);
};

export function useProposal(): ProposalContextType {
	return useContext(ProposalContext);
}
