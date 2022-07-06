import { FC } from "react";
import { If } from "react-extras";

import type {
	ProposalCall,
	ProposalDetails,
	ProposalInfo,
} from "@app-gov/node/types";
import { ReferendumStats } from "@app-gov/web/types";

import { Markdown } from "./";

interface ProposalDetailsDisplayProps {
	proposalDetails: ProposalDetails;
	proposalInfo: ProposalInfo;
	proposalStatus: string;
	proposalCall: ProposalCall;
	referendum: ReferendumStats;
}

export const ProposalDetailsDisplay: FC<ProposalDetailsDisplayProps> = ({
	proposalDetails,
	proposalInfo,
	proposalStatus,
	proposalCall,
	referendum,
}) => {
	const { method, section, args } = proposalCall || {};

	return (
		<div className="text-lg">
			<div className="space-y-8">
				<div className="text-xl">
					<Markdown input={proposalDetails?.description || "Undefined"} />
				</div>

				<div className="border-4 border-hero p-4 shadow-sharp-7 shadow-hero/40 space-y-6 bg-white">
					<div className="flex w-full space-x-20">
						<div>
							<span className="font-bold uppercase">Status</span>
							<p>{proposalStatus}</p>
						</div>
						<div>
							<span className="font-bold uppercase">Enactment delay</span>
							<p>{proposalInfo?.enactmentDelay || 0} blocks</p>
						</div>
					</div>
					<div>
						<span className="font-bold uppercase">Sponsor</span>
						<p>{proposalInfo?.sponsor}</p>
					</div>

					<If condition={section !== "undefined"}>
						<div>
							<div className="flex space-x-36">
								<div>
									<span className="font-bold uppercase">Proposed Call</span>
									<div>
										{section}.{method}
									</div>
								</div>
								<If condition={!!referendum}>
									<div>
										<span className="font-bold uppercase">Veto Sum</span>
										<div>
											{referendum.vetoPercentage} / {referendum.vetoThreshold} %
										</div>
									</div>
								</If>
							</div>
							<If condition={!!args}>
								<div className="w-full mt-2 mb-6">
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
							</If>
						</div>
					</If>
				</div>
			</div>
		</div>
	);
};
