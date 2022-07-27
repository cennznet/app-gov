import { FC, MouseEventHandler } from "react";
import { Choose, If } from "react-extras";

import {
	DISCORD_CHANNEL_IDS,
	DISCORD_WEBSITE_BOT,
} from "@app-gov/service/env-vars";
import { ProposalNewFormState } from "@app-gov/web/hooks";
import { DiscordLogo } from "@app-gov/web/vectors";

import {
	Button,
	StepProgress,
	TransactionDialog,
	TransactionDialogProps,
} from "./";

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
			<StepProgress
				steps={["Confirm", "Submit", "Process", "Success!"]}
				stepIndex={["Sign", "Submit", "Process", "Complete"].indexOf(
					formState.step
				)}
				error={formState?.status === "NotOk"}
			>
				<Choose>
					<Choose.When condition={formState?.status === "Ok"}>
						<p className="prose text-center  text-sm">
							Your proposal has been submitted successfully!
						</p>
						<div className="mt-8 flex w-full flex-col items-center justify-center text-center">
							<div className="mb-4">
								<a
									href={`https://discord.com/channels/${DISCORD_WEBSITE_BOT.ServerId}/${DISCORD_CHANNEL_IDS[0]}`}
									target="_blank"
									rel="noreferrer"
								>
									<Button startAdornment={<DiscordLogo className="h-4" />}>
										View proposal on Discord
									</Button>
								</a>
							</div>

							<div>
								<Button onClick={onDismiss} variant="white">
									Submit another
								</Button>
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

					<Choose.When
						condition={
							formState?.step === "Submit" || formState?.step === "Process"
						}
					>
						<p className="prose text-center text-sm">
							Please wait until this proccess completes...
						</p>
					</Choose.When>
				</Choose>
			</StepProgress>
		</TransactionDialog>
	);
};
