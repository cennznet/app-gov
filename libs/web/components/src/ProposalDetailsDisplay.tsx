import { FC } from "react";
import { classNames, If } from "react-extras";

import type {
	ProposalCall,
	ProposalDetails,
	ProposalInfo,
} from "@app-gov/node/types";
import { PropsWithChildren } from "@app-gov/web/types";

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
			<div className="drop-shadow-sm space-y-8">
				<Shadow shadowClassName="text-lg space-y-4 group">
					<Skeleton condition={!!proposalDetails} variant="large">
						<div className="group-hover:border-l-4 group-hover:pl-2 duration-300 border-gray-400">
							<Markdown input={proposalDetails?.description || "Undefined"} />
						</div>
					</Skeleton>
				</Shadow>

				<Shadow shadowClassName="space-y-6">
					<div className="flex w-full space-x-20">
						<div>
							<span className="font-bold text-xl">Status</span>
							<Skeleton condition={!!proposalStatus} variant="small">
								{proposalStatus}
							</Skeleton>
						</div>
						<div>
							<span className="font-bold text-xl">Enactment delay</span>
							<Skeleton condition={!!proposalInfo} variant="small">
								{proposalInfo?.enactmentDelay || 0} blocks
							</Skeleton>
						</div>
					</div>
					<div>
						<span className="font-bold text-xl">Sponsor</span>
						<Skeleton condition={!!proposalInfo} variant="long">
							{proposalInfo?.sponsor}
						</Skeleton>
					</div>

					<If condition={section !== "undefined"}>
						<div>
							<span className="font-bold text-xl">Proposed Call</span>
							<div>
								<Skeleton condition={!!section || !!method} variant="small">
									{section}.{method}
								</Skeleton>
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
													<td className="break-all text-right">
														"{args[key]}"
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</If>
						</div>
					</If>
				</Shadow>
			</div>
		</div>
	);
};

interface SkeletonProps extends PropsWithChildren {
	condition: boolean;
	variant: "small" | "large" | "long";
}

const Skeleton: FC<SkeletonProps> = ({ children, condition, variant }) => {
	if (condition) return <div>{children}</div>;

	return (
		<div className="flex animate-pulse">
			<div
				className={classNames(
					"bg-gray-600/50 rounded",
					{ small: "w-32 h-4", large: "w-56 h-6", long: "w-2/3 h-4" }[variant]
				)}
			/>
		</div>
	);
};

interface ShadowProps extends PropsWithChildren {
	shadowClassName?: string;
}

const Shadow: FC<ShadowProps> = ({ shadowClassName, children }) => (
	<div className="bg-hero py-2 pr-2 translate-x-2">
		<div
			className={classNames(
				shadowClassName,
				"p-4 bg-mid border-4 border-dark -mt-4 -ml-2"
			)}
		>
			{children}
		</div>
	</div>
);
