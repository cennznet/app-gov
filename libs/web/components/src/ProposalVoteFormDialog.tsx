import { FC, MouseEventHandler } from "react";
import { Choose, If } from "react-extras";

import { ProposalInfo } from "@app-gov/service/cennznet";
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

interface ProposalVoteFormDialogProps extends TransactionDialogProps {
	formState: ProposalNewFormState;
	onDismiss: MouseEventHandler<HTMLButtonElement>;
	proposalStatus: ProposalInfo["status"];
}

export const ProposalVoteFormDialog: FC<ProposalVoteFormDialogProps> = ({
	formState,
	onDismiss,
	proposalStatus,
	...props
}) => {
	const isCouncil = proposalStatus === "Deliberation";

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
							Your vote has been submitted!
						</p>

						<div className="mt-8 flex w-full flex-col items-center justify-center text-center">
							<div className="mb-4">
								<a
									href={`https://discord.com/channels/${
										DISCORD_WEBSITE_BOT.ServerId
									}/${DISCORD_CHANNEL_IDS[isCouncil ? 0 : 1]}`}
									target="_blank"
									rel="noreferrer"
								>
									<Button startAdornment={<DiscordLogo className="h-4" />}>
										View {isCouncil ? "proposal" : "referendum"} on Discord
									</Button>
								</a>
							</div>
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
