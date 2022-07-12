import { FC, MouseEventHandler } from "react";
import { Choose, If } from "react-extras";

import { Button, StepProgress } from "@app-gov/web/components";
import { IdentityFormState } from "@app-gov/web/hooks";
import { DiscordLogo } from "@app-gov/web/vectors";

import { TransactionDialog, TransactionDialogProps } from "./";

interface IdentityFormDialogProps extends TransactionDialogProps {
	formState: IdentityFormState;
	onDismiss: MouseEventHandler<HTMLButtonElement>;
}

export const IdentityFormDialog: FC<IdentityFormDialogProps> = ({
	formState,
	onDismiss,
	...props
}) => {
	const errorAssigningDiscordRole =
		formState?.statusMessage?.includes("DISCORD");

	return (
		<TransactionDialog {...props}>
			<StepProgress
				steps={["Confirming", "Submitting", "Processing", "Success!"]}
				stepIndex={["Await", "Submit", "Process", "Success"].indexOf(
					formState?.step
				)}
				error={formState?.status === "NotOk"}
			>
				<Choose>
					<Choose.When condition={formState?.status === "Ok"}>
						<p className="prose text-center text-sm">
							Your identity has been successfully set.&nbsp;
							<If condition={!errorAssigningDiscordRole}>
								Visit Discord to view the Governance channels with your new
								role!
							</If>
						</p>
						<div className="mt-8 flex w-full flex-col items-center justify-center text-center">
							<div className="mb-4">
								<a
									href={
										!errorAssigningDiscordRole
											? "https://discord.gg/zbwXQZCcwr"
											: "http://discord.gg/cennznet"
									}
									target="_blank"
									rel="noreferrer"
								>
									<Button startAdornment={<DiscordLogo className="h-4" />}>
										{!errorAssigningDiscordRole
											? "Visit Governance Channel"
											: "Join Our Discord"}
									</Button>
								</a>
							</div>

							<div>
								<Button onClick={onDismiss} variant="white" className="w-28">
									Dismiss
								</Button>
							</div>
						</div>
					</Choose.When>

					<Choose.When condition={formState?.status === "NotOk"}>
						<p className="prose text-center text-sm">
							Something went wrong while processing your request.
						</p>

						<If condition={!!formState?.statusMessage}>
							<p className="mt-2 bg-white/50 px-8 py-4 font-mono text-xs">
								{formState?.statusMessage}
							</p>
						</If>

						<div className="mt-8 flex justify-center">
							<Button onClick={onDismiss} className="w-28">
								Dismiss
							</Button>
						</div>
					</Choose.When>

					<Choose.When condition={formState?.step === "Await"}>
						<p className="prose text-center text-sm">
							Please sign the transaction when prompted...
						</p>
					</Choose.When>

					<Choose.When
						condition={
							formState?.step !== "Idle" && formState?.status !== "NotOk"
						}
					>
						<p className="prose text-center text-sm">
							Please wait until this process completes...
						</p>
					</Choose.When>
				</Choose>
			</StepProgress>
		</TransactionDialog>
	);
};
