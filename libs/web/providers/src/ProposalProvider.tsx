import type { PropsWithChildren } from "@app-gov/web/types";

import {
	FC,
	createContext,
	useState,
	useContext,
	ChangeEventHandler,
} from "react";
import { useControlledInput } from "@app-gov/web/hooks";

interface ProposalContextType {
	proposalTitle: string;
	onProposalTitleChange: ChangeEventHandler<HTMLInputElement>;

	proposalDetails: string;
	onProposalDetailsChange: ChangeEventHandler<HTMLTextAreaElement>;

	proposalDelay: number;
	onProposalDelayChange: ChangeEventHandler<HTMLInputElement>;

	proposalCall: ProposalCall | undefined;
	updateProposalCall: (section: string, value: string, arg?: string) => void;
}

const ProposalContext = createContext<ProposalContextType>(
	{} as ProposalContextType
);

interface ProposalProviderProps extends PropsWithChildren {}

interface ProposalCall {
	module?: string;
	call?: string;
	values?: Record<string, string>;
}

export const ProposalProvider: FC<ProposalProviderProps> = ({ children }) => {
	const { value: proposalTitle, onChange: onProposalTitleChange } =
		useControlledInput<string, HTMLInputElement>("");

	const { value: proposalDetails, onChange: onProposalDetailsChange } =
		useControlledInput<string, HTMLTextAreaElement>("");

	const { value: proposalDelay, onChange: onProposalDelayChange } =
		useControlledInput<number, HTMLInputElement>(1);

	const [proposalCall, setProposalCall] = useState<ProposalCall>();
	const updateProposalCall = (section: string, value: string, arg?: string) =>
		setProposalCall((prev) => ({
			...prev,
			[section]: arg ? { [arg]: value } : value,
		}));

	return (
		<ProposalContext.Provider
			value={{
				proposalTitle,
				onProposalTitleChange,

				proposalDetails,
				onProposalDetailsChange,

				proposalDelay,
				onProposalDelayChange,

				proposalCall,
				updateProposalCall,
			}}
		>
			{children}
		</ProposalContext.Provider>
	);
};

export function useProposal(): ProposalContextType {
	return useContext(ProposalContext);
}
