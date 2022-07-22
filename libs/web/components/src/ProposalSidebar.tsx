import { FC, useMemo } from "react";
import { classNames, If } from "react-extras";

import { getHourInBlocks } from "@app-gov/node/utils";
import { ProposalModel } from "@app-gov/service/mongodb";
import { useCENNZApi } from "@app-gov/web/providers";
import { IntrinsicElements } from "@app-gov/web/utils";
import { ThumbDown, ThumbUp } from "@app-gov/web/vectors";

interface ProposalSidebarProps {
	proposal: ProposalModel;
	vetoThreshold: string;
}

export const ProposalSidebar: FC<
	ProposalSidebarProps & IntrinsicElements["div"]
> = ({ className, proposal, vetoThreshold, ...props }) => {
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
			<If condition={status === "ReferendumDeliberation"}>
				<VetoInfo proposal={proposal} vetoThreshold={vetoThreshold} />
			</If>
			<DelayInfo enactmentDelay={enactmentDelay} />
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
				<span>Current: {votePercentage?.toFixed(2)}% / Require: 50%</span>
			</div>
		</>
	);
};

interface VetoInfoProps {
	proposal: ProposalModel;
	vetoThreshold: string;
}

const VetoInfo: FC<VetoInfoProps & IntrinsicElements["div"]> = ({
	proposal,
	vetoThreshold,
	...props
}) => {
	const { vetoPercentage } = proposal;

	return (
		<div {...props}>
			<label className="font-display text-hero block font-bold uppercase">
				Threshold to Veto
			</label>
			<span>
				Current: {vetoPercentage?.toFixed(2)}% / Required: {vetoThreshold}%
			</span>
		</div>
	);
};

interface DelayInfoProps {
	enactmentDelay: number | undefined;
}

const DelayInfo: FC<DelayInfoProps & IntrinsicElements["div"]> = ({
	enactmentDelay,
	...props
}) => {
	const { api } = useCENNZApi();

	const enactmentDelayInHours = useMemo(() => {
		if (!api || !enactmentDelay) return;

		return enactmentDelay / getHourInBlocks(api);
	}, [api, enactmentDelay]);

	return (
		<div {...props}>
			<label className="font-display text-hero block font-bold uppercase">
				Enactment Delay
			</label>
			<span>{enactmentDelay} blocks</span>
			{enactmentDelayInHours && <span> / {enactmentDelayInHours} hours</span>}
		</div>
	);
};
