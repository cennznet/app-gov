import { FC, useCallback, useRef } from "react";
import { If } from "react-extras";

import { ProposalModel } from "@app-gov/service/mongodb";
import { IntrinsicElements } from "@app-gov/web/utils";
import { ThumbDown, ThumbUp } from "@app-gov/web/vectors";

import { AccountSelect, Button } from "./";

interface ProposalVoteFormProps {
	proposal: ProposalModel;
	onPass: () => void;
	onReject: () => void;
}

export const ProposalVoteForm: FC<
	ProposalVoteFormProps & Omit<IntrinsicElements["form"], "onSubmit">
> = ({ proposal, onPass, onReject, ...props }) => {
	const { status } = proposal;
	const ref = useRef<HTMLFormElement>(null);

	const onClick = useCallback((onCall: () => void) => {
		if (!ref.current?.reportValidity()) return;
		onCall();
	}, []);

	return (
		<form {...props} ref={ref}>
			<h2 className="font-display border-hero mb-4 border-b-2 text-3xl uppercase">
				Signing Wallet
			</h2>

			<fieldset className="mb-6">
				<p className="prose mb-[1em] text-base">
					Ex consequat occaecat id nulla voluptate anim eu velit et laboris
					reprehenderit ut dolor magna ut minim voluptate labore non adipisicing
				</p>
				<AccountSelect required name="sponsor" />
			</fieldset>

			<fieldset className="mt-16 text-center">
				<If condition={status === "Deliberation"}>
					<div className="grid grid-cols-2 gap-8">
						<div className="col-span-1 text-right">
							<Button
								startAdornment={<ThumbDown />}
								className="relative"
								onClick={() => onClick(onReject)}
							>
								<span>Reject</span>
							</Button>
						</div>
						<div className="col-span-1 text-left">
							<Button
								startAdornment={<ThumbUp />}
								onClick={() => onClick(onPass)}
							>
								<span>Pass</span>
							</Button>
						</div>
					</div>
				</If>

				<If condition={status === "ReferendumDeliberation"}>
					<Button
						startAdornment={<ThumbDown />}
						className="relative"
						onClick={() => onClick(onReject)}
					>
						<span>Veto</span>
					</Button>
				</If>

				<p className="mt-2 text-sm">Estimated gas fee 2 CPAY</p>
			</fieldset>
		</form>
	);
};
