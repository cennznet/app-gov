import { FC, useMemo, Dispatch, SetStateAction } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import { AutoGrowInput } from "@app-gov/web/components";
import { ChevronDown } from "@app-gov/web/vectors";
import { Extrinsics } from "@app-gov/node/artifacts";

interface ProposalAdvancedProps {
	cennzModule: string;
	setCennzModule: Dispatch<SetStateAction<string>>;
	cennzCall: string;
	setCennzCall: Dispatch<SetStateAction<string>>;
	cennzValues: Record<string, string>;
	setCennzValue: (arg: string, value: string) => void;
}

export const ProposalAdvanced: FC<ProposalAdvancedProps> = ({
	cennzModule,
	setCennzModule,
	cennzCall,
	setCennzCall,
	cennzValues,
	setCennzValue,
}) => {
	const [open, setOpen] = useState<boolean>(false);

	const extrinsicArgs = useMemo<string[]>(() => {
		const _module = Extrinsics.find((ex: any) => ex.section === cennzModule);
		if (!_module) return [];

		const call = _module.methods.find(
			(method: any) => method.name === cennzCall
		);
		if (!call) return [];

		return call.args
			.split(",")
			.map((args: string) => args.split(":")[0])
			.filter(Boolean);
	}, [cennzModule, cennzCall]);

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
						value={cennzModule}
						onChange={setCennzModule}
					/>
					<p className="mx-2 tracking-widest">.</p>
					<AutoGrowInput
						placeholder="call"
						value={cennzCall}
						onChange={setCennzCall}
					/>
				</fieldset>
				<label htmlFor="cennzValues" className="text-lg">
					Values
				</label>
				<fieldset
					id="cennzValues"
					className="border-dark w-full space-y-6 border-[3px] bg-white px-4 py-4"
				>
					{extrinsicArgs?.map((arg, index) => (
						<div key={index}>
							<AutoGrowInput
								inputClassName="border-b border-hero min-w-[15em]"
								placeholder={arg}
								value={cennzValues?.[arg] || ""}
								onChange={(value) => setCennzValue(arg, value)}
							/>
						</div>
					))}
				</fieldset>
			</If>
		</div>
	);
};
