import { FC, MouseEventHandler } from "react";
import { Choose, If } from "react-extras";

import { StepProgress } from "@app-gov/web/components";
import { ProposalNewFormState } from "@app-gov/web/hooks";

import { Button, TransactionDialog, TransactionDialogProps } from "./";

interface ProposalVoteFormDialogProps extends TransactionDialogProps {
	formState: ProposalNewFormState;
	onDismiss: MouseEventHandler<HTMLButtonElement>;
}

export const ProposalVoteFormDialog: FC<ProposalVoteFormDialogProps> = ({
	formState,
	onDismiss,
	...props
}) => {
	return (
		<TransactionDialog {...props}>
			<StepProgress
				steps={["Confirm", "Submit", "Success!"]}
				stepIndex={["Sign", "Submit", "Complete"].indexOf(formState.step)}
				error={formState?.status === "NotOk"}
			>
				<Choose>
					<Choose.When condition={formState?.status === "Ok"}>
						<p className="prose text-center  text-sm">
							Your vote has been submitted
						</p>
						<div className="mt-8 flex w-full flex-col items-center justify-center text-center">
							<div>
								<Button onClick={onDismiss}>Dismiss</Button>
							</div>
						</div>
					</Choose.When>

					<Choose.When condition={formState?.status === "NotOk"}>
						<p className="prose text-center text-sm">
							Something went wrong while processing your request.
						</p>

						<If condition={!!formState?.statusMessage}>
							<p className="prose mt-2 bg-white/50 px-8 py-4 font-mono text-xs">
								{formState?.statusMessage}
							</p>
						</If>

						<div className="mt-8 flex justify-center">
							<Button onClick={onDismiss} className="w-28">
								Dismiss
							</Button>
						</div>
					</Choose.When>

					<Choose.When condition={formState?.step === "Sign"}>
						<p className="prose text-center text-sm">
							Please sign the transaction when prompted...
						</p>
					</Choose.When>

					<Choose.When condition={formState?.step === "Submit"}>
						<p className="prose text-center text-sm">
							Please wait until this process completes...
						</p>
					</Choose.When>
				</Choose>
			</StepProgress>
		</TransactionDialog>
	);
};
