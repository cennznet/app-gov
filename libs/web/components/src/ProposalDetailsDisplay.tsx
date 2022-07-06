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
		<div className="text-lg">
			<div className="space-y-8">
				<Skeleton condition={!!proposalDetails} variant="large">
					<div className="border-l-4 duration-300 border-hero p-4 text-xl">
						<Markdown input={proposalDetails?.description || "Undefined"} />
					</div>
				</Skeleton>

				<div className="border-4 border-hero p-4 shadow-sharp-7 shadow-hero/40 space-y-6">
					<div className="flex w-full space-x-20">
						<div>
							<span className="font-bold text-xl uppercase">Status</span>
							<Skeleton condition={!!proposalStatus} variant="small">
								{proposalStatus}
							</Skeleton>
						</div>
						<div>
							<span className="font-bold text-xl uppercase">
								Enactment delay
							</span>
							<Skeleton condition={!!proposalInfo} variant="small">
								{proposalInfo?.enactmentDelay || 0} blocks
							</Skeleton>
						</div>
					</div>
					<div>
						<span className="font-bold text-xl uppercase">Sponsor</span>
						<Skeleton condition={!!proposalInfo} variant="long">
							{proposalInfo?.sponsor}
						</Skeleton>
					</div>

					<If condition={section !== "undefined"}>
						<div>
							<span className="font-bold text-xl uppercase">Proposed Call</span>
							<div>
								<Skeleton condition={!!section || !!method} variant="small">
									{section}.{method}
								</Skeleton>
							</div>
							<If condition={!!args}>
								<div className="px-2 border-2 border-hero mt-2 shadow-sharp shadow-hero/40">
									<div className="w-full mt-2 mb-6 px-2">
										<div className="border-b border-hero flex mb-2 py-2">
											<span className="text-left w-1/2 font-bold">Params</span>
											<span className="text-right w-1/2 font-bold">Values</span>
										</div>
										{Object.keys(args || {})?.map((key) => (
											<div
												key={key}
												className="border-b border-hero border-dashed flex py-2 items-center"
											>
												<span className="pr-20 flex-1">{key}</span>
												<span className="break-all text-right">
													"{args[key]}"
												</span>
											</div>
										))}
									</div>
								</div>
							</If>
						</div>
					</If>
				</div>
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
