import { FC } from "react";
import { classNames } from "react-extras";

import { ProposalModel } from "@app-gov/service/mongodb";
import { IntrinsicElements } from "@app-gov/web/utils";

interface SidebarProps {
	proposal: ProposalModel;
}

export const ProposalSidebar: FC<SidebarProps & IntrinsicElements["div"]> = ({
	className,
	proposal,
	...props
}) => {
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
				<span>{proposal.status}</span>
			</div>
			<div>
				<label className="font-display text-hero block font-bold uppercase">
					Enactment Delay
				</label>
				<span>{proposal.enactmentDelay} blocks</span>
			</div>
			<div>
				<label className="font-display text-hero block font-bold uppercase">
					Sponsor
				</label>
				<span className="whitespace-pre-wrap break-words">
					{proposal.sponsor}
				</span>
			</div>
		</div>
	);
};
