import { FC } from "react";
import { classNames, If } from "react-extras";

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
				<div className="shadow-md p-4 space-y-6 border border-hero rounded">
					<span className="text-4xl">
						{proposalDetails ? (
							<p>{proposalDetails?.title || "Untitled"}</p>
						) : (
							<Skeleton skeletonClassName="w-64 h-12" />
						)}
					</span>
					<div className="flex w-full space-x-20">
						<div>
							<span className="font-bold text-xl">Status</span>
							{proposalStatus ? (
								<p>{proposalStatus}</p>
							) : (
								<Skeleton skeletonClassName="w-32 h-6" />
							)}
						</div>
						<div>
							<span className="font-bold text-xl">Enactment delay</span>
							{proposalInfo ? (
								<p>{proposalInfo?.enactmentDelay || 0} blocks</p>
							) : (
								<Skeleton skeletonClassName="w-32 h-6" />
							)}
						</div>
					</div>
					<div>
						<span className="font-bold text-xl">Sponsor</span>
						{proposalInfo ? (
							<p>{proposalInfo.sponsor}</p>
						) : (
							<Skeleton skeletonClassName="w-2/3 h-6" />
						)}
					</div>
				</div>

				<div className="shadow-md p-4 border border-hero rounded">
					<span className="font-bold text-xl">Proposed Call</span>
					<div>
						{section && method ? (
							<p>
								{section}.{method}
							</p>
						) : (
							<Skeleton skeletonClassName="w-32 h-6" />
						)}
					</div>
					<If condition={!!args}>
						<div className="px-2 border border-hero rounded border-dotted shadow-sm mt-2">
							<table className="w-full mt-2 mb-6">
								<tbody>
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

				<div className="text-lg space-y-2 shadow-md p-4 border border-hero rounded">
					<span className="font-bold text-xl">Justification</span>
					{proposalDetails ? (
						<Markdown input={proposalDetails?.description || "Undefined"} />
					) : (
						<div className="space-y-2">
							<Skeleton skeletonClassName="w-32 h-6" />
							<Skeleton skeletonClassName="w-56 h-6" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

interface SkeletonInterface {
	skeletonClassName: string;
}

const Skeleton: FC<SkeletonInterface> = ({ skeletonClassName }) => (
	<div className="flex animate-pulse">
		<div className={classNames(skeletonClassName, "bg-gray-600/50 rounded")} />
	</div>
);
