import type { FC } from "react";
import type { ProposalCall } from "@app-gov/web/types";

import { useMemo, useState } from "react";
import { classNames, If } from "react-extras";
import { ChevronDown } from "@app-gov/web/vectors";
import { Extrinsics } from "@app-gov/node/artifacts";
import { AutoGrowInput } from "@app-gov/web/components";

interface ProposalAdvancedProps {
	proposalCall: ProposalCall | undefined;
	updateProposalCall: (section: string, value: string, arg?: string) => void;
}

export const ProposalAdvanced: FC<ProposalAdvancedProps> = ({
	proposalCall,
	updateProposalCall,
}) => {
	const [open, setOpen] = useState<boolean>(false);

	const extrinsicArgs = useExtrinsicArgs(proposalCall);

	return (
		<div className="w-full">
			<div
				className={classNames(
					"mt-6 inline-flex cursor-pointer items-center text-lg",
					open && "mb-4"
				)}
				onClick={() => setOpen(!open)}
			>
				Advanced{" "}
				<span className={classNames("duration-200", open && "rotate-180")}>
					<ChevronDown />
				</span>
			</div>
			<br />
			<If condition={open}>
				<label htmlFor="cennzExtrinsic" className="text-lg">
					Extrinsic
				</label>
				<fieldset
					id="cennzExtrinsic"
					className="border-dark mb-4 inline-flex w-full items-center border-[3px] bg-white px-4 py-2"
				>
					<p className="mr-2 tracking-widest text-gray-600">api.tx.</p>
					<AutoGrowInput
						placeholder="module"
						value={proposalCall?.module || ""}
						onChange={(value) => updateProposalCall("module", value)}
					/>
					<p className="mx-2 tracking-widest">.</p>
					<AutoGrowInput
						placeholder="call"
						value={proposalCall?.call || ""}
						onChange={(value) => updateProposalCall("call", value)}
					/>
				</fieldset>
				<label htmlFor="cennzValues" className="text-lg">
					Values
				</label>
				<fieldset
					id="cennzValues"
					className="border-dark w-full space-y-6 border-[3px] bg-white px-4 py-4"
				>
					<If condition={!!extrinsicArgs}>
						{extrinsicArgs?.map((arg, index) => (
							<div key={index}>
								<AutoGrowInput
									inputClassName="border-b border-hero min-w-[15em]"
									placeholder={arg}
									value={proposalCall?.values?.[arg] || ""}
									onChange={(value) => updateProposalCall("values", value, arg)}
								/>
							</div>
						))}
					</If>
					<If condition={!extrinsicArgs?.length}>
						<p className="tracking-wide text-gray-600">No values required</p>
					</If>
				</fieldset>
			</If>
		</div>
	);
};

const useExtrinsicArgs = (proposalCall: ProposalCall | undefined) => {
	return useMemo<string[]>(() => {
		const cennzModule = Extrinsics.find(
			(ex: any) => ex.section === proposalCall?.module
		);
		if (!cennzModule) return [];

		const call = cennzModule.methods.find(
			(method: any) => method.name === proposalCall?.call
		);
		if (!call) return [];

		return call.args
			.split(",")
			.map((args: string) => args.split(":")[0])
			.filter(Boolean);
	}, [proposalCall]);
};
