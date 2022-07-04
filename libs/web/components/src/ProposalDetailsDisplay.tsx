import type { FC } from "react";

import type {
	ProposalCall,
	ProposalDetails,
	ProposalInfo,
} from "@app-gov/node/types";

import { Markdown } from "./";

interface ProposalDetailsDisplayProps {
	proposalDetails: ProposalDetails;
	proposalInfo: ProposalInfo;
	proposalStatus: string;
	proposalCall: ProposalCall;
}

export const ProposalDetailsDisplay: FC<ProposalDetailsDisplayProps> = ({
	proposalDetails,
	proposalInfo,
	proposalStatus,
	proposalCall,
}) => {
	const { method, section, args } = proposalCall || {};

	const params = [...Object.values(args || {})];

	return (
		<div>
			<div className="space-y-6">
				<span className="border-hero border-b-2 text-4xl">
					{proposalDetails?.title || "Untitled"}
				</span>
				<div className="flex w-full space-x-20">
					<div>
						<span className="italic">Enactment delay</span>
						<p>{proposalInfo?.enactmentDelay || 0} blocks</p>
					</div>
					<div>
						<span className="italic">Status</span>
						<p>{proposalStatus}</p>
					</div>
				</div>
				<div>
					<span className="italic">Sponsor</span>
					<p>{proposalInfo?.sponsor}</p>
				</div>
				<div>
					<span className="italic">Proposal Call</span>
					<div>
						api.tx.{section}.{method}
						{"("}
						{params.map((arg) => (
							<span>
								{arg}
								{arg !== params[params.length - 1] && ","}
							</span>
						))}
						{")"}
					</div>
				</div>
			</div>
			<div className="border-hero my-6 w-full border-b-2" />
			<div className="text-xl">
				<Markdown input={proposalDetails?.description} />
			</div>
		</div>
	);
};
