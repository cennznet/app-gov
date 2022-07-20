import { FC } from "react";
import { classNames, If } from "react-extras";

import { ProposalModel } from "@app-gov/service/mongodb";
import { IntrinsicElements } from "@app-gov/web/utils";
import { ThumbDown, ThumbUp } from "@app-gov/web/vectors";

interface ProposalSidebarProps {
	proposal: ProposalModel;
}

export const ProposalSidebar: FC<
	ProposalSidebarProps & IntrinsicElements["div"]
> = ({ className, proposal, ...props }) => {
	const { status, enactmentDelay, sponsor } = proposal;

	return (
		<div
			{...props}
			className={classNames(
				className,
				"border-hero shadow-sharp-6 shadow-hero/40 space-y-6 border-4 bg-white p-4"
			)}
		>
			<div>
				<label className="font-display text-hero block font-bold uppercase">
					Status
				</label>
				<span>{status}</span>
			</div>
			<If condition={status === "Deliberation"}>
				<VotesInfo proposal={proposal} />
			</If>
			<div>
				<label className="font-display text-hero block font-bold uppercase">
					Enactment Delay
				</label>
				<span>{enactmentDelay} blocks</span>
			</div>
			<div>
				<label className="font-display text-hero block font-bold uppercase">
					Sponsor
				</label>
				<span className="whitespace-pre-wrap break-words">{sponsor}</span>
			</div>
		</div>
	);
};

interface VotesInfoProps {
	proposal: ProposalModel;
}

const VotesInfo: FC<VotesInfoProps & IntrinsicElements["div"]> = ({
	proposal,
	...props
}) => {
	const { passVotes, rejectVotes, votePercentage } = proposal;

	return (
		<>
			<div {...props}>
				<label className="font-display text-hero block font-bold uppercase">
					Votes
				</label>
				<div className="flex items-center">
					<div>
						<ThumbUp className="mt-[-4px] inline-block h-[1.125em] w-[1.125em]" />{" "}
						{passVotes}
					</div>
					<div className="mx-2">/</div>
					<div>
						<ThumbDown className="mt-[-4px] inline-block h-[1.125em]  w-[1.125em]" />{" "}
						{rejectVotes}
					</div>
				</div>
			</div>
			<div {...props}>
				<label className="font-display text-hero block font-bold uppercase">
					Threshold to Pass
				</label>
				<span>Current: {votePercentage}% / Require: 50%</span>
			</div>
		</>
	);
};
