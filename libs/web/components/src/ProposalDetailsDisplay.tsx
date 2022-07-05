import { FC } from "react";
import { If } from "react-extras";

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

	return (
		<div>
			<div className="drop-shadow-sm space-y-4">
				<div className="hover:shadow-lg hover:p-2 duration-200 space-y-6 hover:border border-hero rounded">
					<span className="text-4xl">
						{proposalDetails?.title || "Untitled"}
					</span>
					<div className="flex w-full space-x-20">
						<div>
							<span className="font-bold text-xl">Status</span>
							<p>{proposalStatus}</p>
						</div>
						<div>
							<span className="font-bold text-xl">Enactment delay</span>
							<p>{proposalInfo?.enactmentDelay || 0} blocks</p>
						</div>
					</div>
					<div>
						<span className="font-bold text-xl">Sponsor</span>
						<p>{proposalInfo?.sponsor}</p>
					</div>
				</div>

				<div className="hover:shadow-lg hover:p-2 duration-200 hover:border border-hero rounded">
					<span className="font-bold text-xl">Proposed Call</span>
					<div>
						{section}.{method}
					</div>
					<If condition={!!args}>
						<div className="px-2 border border-hero rounded border-dotted shadow-sm mt-2">
							<table className="w-full mt-2 mb-6">
								<tbody className="">
									<tr className="border-b border-dashed border-hero flex mb-2 py-2">
										<th className="text-left w-1/2">Params</th>
										<th className="text-right w-1/2">Values</th>
									</tr>
									{Object.keys(args || {})?.map((key) => (
										<tr
											key={key}
											className="border-b border-hero flex py-2 items-center"
										>
											<td className="pr-20 flex-1">{key}</td>
											<td className="break-all text-right">"{args[key]}"</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</If>
				</div>

				<div className="text-lg space-y-2 hover:shadow-lg hover:p-2 duration-200 hover:border border-hero rounded">
					<span className="font-bold text-xl">Justification</span>
					<Markdown input={proposalDetails?.description} />
				</div>
			</div>
		</div>
	);
};
