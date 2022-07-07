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
		<div className="text-lg">
			<div className="space-y-8">
				<div className="text-xl">
					<Markdown>{proposalDetails?.description}</Markdown>
				</div>

				<div className="border-hero shadow-sharp-7 shadow-hero/40 space-y-6 border-4 bg-white p-4">
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
							<span className="font-bold uppercase">Proposed Call</span>
							<div>
								{section}.{method}
							</div>
							<If condition={!!args}>
								<div className="mt-2 mb-6 w-full">
									<div className="border-hero mb-2 flex border-b py-2">
										<span className="w-1/2 text-left font-bold">Params</span>
										<span className="w-1/2 text-right font-bold">Values</span>
									</div>
									{Object.keys(args || {})?.map((key) => (
										<div
											key={key}
											className="border-hero flex items-center border-b border-dashed py-2"
										>
											<span className="flex-1 pr-20">{key}</span>
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
