import { FC, MouseEventHandler } from "react";
import { Choose, If } from "react-extras";

import { ProposalNewFormState } from "@app-gov/web/hooks";
import {
	CheckCircle,
	DiscordLogo,
	ExclamationCircle,
	Spinner,
} from "@app-gov/web/vectors";

import { Button, TransactionDialog, TransactionDialogProps } from "./";

interface ProposalNewFormDialogProps extends TransactionDialogProps {
	formState: ProposalNewFormState;
	onDismiss: MouseEventHandler<HTMLButtonElement>;
}

export const ProposalNewFormDialog: FC<ProposalNewFormDialogProps> = ({
	formState,
	onDismiss,
	...props
}) => {
	return (
		<TransactionDialog {...props}>
			<Choose>
				<Choose.When condition={formState?.status === "Ok"}>
					<CheckCircle className="text-hero mb-2 h-12 w-12  flex-shrink-0" />
					<div className="font-display text-hero mb-4 text-2xl uppercase">
						Success!
					</div>
					<p className="text-center">
						Your proposal has been submitted successfully, [and maybe some
						message to view the proposal on Discord].
					</p>
					<div className="mt-8 flex w-full flex-col items-center justify-center text-center">
						<div className="mb-4">
							<Button startAdornment={<DiscordLogo className="h-4" />}>
								View proposal on Discord
							</Button>
						</div>

						<div>
							<Button onClick={onDismiss} variant="white">
								Submit another
							</Button>
						</div>
					</div>
				</Choose.When>

				<Choose.When condition={formState?.status === "NotOk"}>
					<ExclamationCircle className="text-hero mb-2 h-12 w-12  flex-shrink-0" />
					<div className="font-display text-hero mb-4 text-2xl uppercase">
						Ah, Error!
					</div>
					<p className="text-center">
						Something went wrong while processing your request.
					</p>

					<If condition={!!formState?.statusMessage}>
						<p className="mt-2 bg-white/50 px-8 py-4 font-mono text-xs">
							{formState?.statusMessage}
						</p>
					</If>

					<div className="mt-8 flex">
						<Button onClick={onDismiss} className="w-28">
							Dismiss
						</Button>
					</div>
				</Choose.When>
				<Choose.When condition={formState?.step === "Await"}>
					<Spinner className="text-hero mb-2 h-8 w-8 flex-shrink-0 animate-spin" />
					<div className="font-display text-hero mb-4 text-2xl uppercase">
						Confirm with Signature [1/3]
					</div>
					<p className="text-center">
						Please sign the transaction when prompted...
					</p>
				</Choose.When>
				<Choose.When condition={formState?.step === "Submit"}>
					<Spinner className="text-hero mb-2 h-8 w-8 flex-shrink-0  animate-spin" />
					<div className="font-display text-hero mb-4 text-2xl uppercase">
						Submitting Request [2/3]
					</div>
					<p className="text-center">
						Please wait until this proccess completes...
					</p>
				</Choose.When>
				<Choose.When condition={formState?.step === "Process"}>
					<Spinner className="text-hero mb-2 h-8 w-8 flex-shrink-0  animate-spin" />
					<div className="font-display text-hero mb-4 text-2xl uppercase">
						Processing Proposal [3/3]
					</div>
					<p className="text-center">
						Please wait until this proccess completes...
					</p>
				</Choose.When>
			</Choose>
		</TransactionDialog>
	);
};
