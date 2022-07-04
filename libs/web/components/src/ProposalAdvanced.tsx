import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";
import { classNames, If } from "react-extras";

import { Extrinsics } from "@app-gov/service/cennznet";
import { Select, TextField } from "@app-gov/web/components";
import type { ProposalCall } from "@app-gov/web/types";
import { ChevronDown } from "@app-gov/web/vectors";

interface ProposalAdvancedProps {
	proposalCall: ProposalCall | undefined;
	updateProposalCall: (section: string, value: string, arg?: string) => void;
}

export const ProposalAdvanced: FC<ProposalAdvancedProps> = ({
	proposalCall,
	updateProposalCall,
}) => {
	const [open, setOpen] = useState<boolean>(false);

	const { cennzCalls, cennzModules, extrinsicArgs } =
		useExtrinsic(proposalCall);

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
					className="border-dark mb-4 inline-flex w-full items-center space-x-6 border-[3px] bg-white px-4 py-2"
				>
					<p className="mr-2 tracking-widest text-gray-600">api.tx.</p>
					<Select
						className="w-[12em] rounded border border-gray-200"
						inputClassName="cursor-pointer"
						defaultValue={proposalCall?.module}
						onChange={(event: ChangeEvent<HTMLSelectElement>) =>
							updateProposalCall("module", event.target.value)
						}
					>
						{cennzModules?.map((module_: string) => (
							<option value={module_} key={module_}>
								{module_}
							</option>
						))}
					</Select>
					<p className="mx-2 tracking-widest">.</p>
					<Select
						className="min-w-[12em] rounded border border-gray-200"
						inputClassName="cursor-pointer"
						defaultValue={proposalCall?.call || cennzCalls[0]}
						onChange={(event: ChangeEvent<HTMLSelectElement>) =>
							updateProposalCall("call", event.target.value)
						}
					>
						{cennzCalls?.map((call: string) => (
							<option value={call} key={call}>
								{call}
							</option>
						))}
					</Select>
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
								<TextField
									className="border-none"
									inputClassName="border-b border-hero w-full truncate"
									placeholder={arg}
									value={proposalCall?.values?.[arg] || ""}
									onChange={(event) =>
										updateProposalCall("values", event.target.value, arg)
									}
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

interface Extrinsic {
	section: string;
	methods: Array<ExtrinsicMethod>;
}

interface ExtrinsicMethod {
	name: string;
	args: string;
}

const useExtrinsic = (proposalCall: ProposalCall | undefined) => {
	const cennzModules = Extrinsics.map((ex: Extrinsic) => ex.section);

	const selectedModule = useMemo(
		() =>
			Extrinsics.find((ex: Extrinsic) => ex.section === proposalCall?.module) ||
			Extrinsics[0],
		[proposalCall?.module]
	);

	const cennzCalls = useMemo(
		() => selectedModule?.methods.map((method: ExtrinsicMethod) => method.name),
		[selectedModule, proposalCall?.module]
	);

	const extrinsicArgs = useMemo<string[]>(() => {
		const selectedCall = selectedModule?.methods.find(
			(method: any) => method.name === proposalCall?.call
		);
		if (!selectedCall) return [];

		return selectedCall.args
			.split(",")
			.map((args: string) => args.split(":")[0])
			.filter(Boolean);
	}, [selectedModule, proposalCall]);

	return { cennzModules, cennzCalls, extrinsicArgs };
};
