import type { GetStaticProps, NextPage } from "next";
import { FormEvent, useCallback, useEffect } from "react";
import {
	DiscordLogo,
	TwitterLogo,
	Spinner,
	X,
	CheckCircle,
	ExclamationCircle,
} from "@app-gov/web/vectors";
import { useSocialSignIn, useIdentityConnectForm } from "@app-gov/web/hooks";
import { Choose, If } from "react-extras";
import {
	Button,
	TextField,
	WalletSelect,
	Layout,
	Header,
	TransactionDialog,
	useTransactionDialog,
} from "@app-gov/web/components";
import { getApiInstance } from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import { fetchRequiredRegistrars } from "@app-gov/node/utils";

interface StaticProps {
	twitterRegistrarIndex: number;
	discordRegistrarIndex: number;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);
	const { twitter, discord } = await fetchRequiredRegistrars(api);

	return {
		props: {
			twitterRegistrarIndex: twitter.index,
			discordRegistrarIndex: discord.index,
		},
	};
};

const Connect: NextPage<StaticProps> = ({
	twitterRegistrarIndex,
	discordRegistrarIndex,
}) => {
	const {
		onSignInClick: onTwitterSignInClick,
		username: twitterUsername,
		clearUsername: clearTwitterUsername,
	} = useSocialSignIn("Twitter");
	const {
		onSignInClick: onDiscordSignInClick,
		username: discordUsername,
		clearUsername: clearDiscordUsername,
	} = useSocialSignIn("Discord");

	const { submitForm, formState, resetFormState } = useIdentityConnectForm();
	const { open, openDialog, closeDialog } = useTransactionDialog();

	const onFormSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			openDialog();
			submitForm(new FormData(event.target as HTMLFormElement));
		},
		[openDialog, submitForm]
	);

	const onDismissClick = useCallback(() => {
		closeDialog();
		clearTwitterUsername();
		clearDiscordUsername();
		setTimeout(() => {
			resetFormState();
		}, 200);
	}, [clearDiscordUsername, clearTwitterUsername, closeDialog, resetFormState]);

	useEffect(() => {
		if (formState?.status === "Cancelled") closeDialog();
	}, [closeDialog, formState]);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const onNoop = useCallback(() => {}, []);

	const onDialogClose = useCallback(() => {
		if (formState?.status === "Cancelled") return;
		onDismissClick();
	}, [onDismissClick, formState?.status]);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<form onSubmit={onFormSubmit}>
					<h1 className="font-display mb-8 text-center text-7xl uppercase">
						Set your identity
					</h1>

					<p className="mb-8 text-lg">
						To become a Citizen or Councillor, we need you to verify your
						identity. This involves connecting your wallet, and two social
						channels (Twitter and Discord). Get started below!
					</p>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your wallet
					</h2>
					<p className="mb-8">
						Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
						labore dolor mollit commodo do anim incididunt sunt id pariatur elit
						tempor nostrud nulla eu proident ut id qui incididunt.
					</p>
					<fieldset className="mb-12 min-w-0">
						<WalletSelect required name="address" />
					</fieldset>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your social channels
					</h2>
					<p className="mb-8">
						Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
						labore dolor mollit commodo do anim incididunt sunt id pariatur elit
						tempor nostrud nulla eu proident ut id qui incididunt.
					</p>
					<fieldset className="mb-12">
						<div className="grid grid-cols-2 items-center gap-4">
							<TextField
								placeholder="Sign-in to verify"
								inputClassName="!py-4"
								name="twitterUsername"
								value={twitterUsername}
								onInput={onNoop}
								required
								endAdornment={
									<div className="flex items-center">
										<If condition={!!twitterUsername}>
											<div
												className="hover:text-hero mr-2 cursor-pointer transition-colors"
												onClick={clearTwitterUsername}
											>
												<X />
											</div>
										</If>
										<Button
											size="small"
											onClick={onTwitterSignInClick}
											active={!!twitterUsername}
											startAdornment={<TwitterLogo className="h-4" />}
										>
											{twitterUsername ? "Verified" : "Sign In"}
										</Button>
									</div>
								}
							/>

							<TextField
								placeholder="Sign-in to verify"
								inputClassName="!py-4"
								name="discordUsername"
								value={discordUsername}
								onChange={onNoop}
								required
								endAdornment={
									<div className="flex items-center">
										<If condition={!!discordUsername}>
											<div
												className="hover:text-hero mr-2 cursor-pointer transition-colors"
												onClick={clearDiscordUsername}
											>
												<X />
											</div>
										</If>
										<Button
											size="small"
											onClick={onDiscordSignInClick}
											active={!!discordUsername}
											startAdornment={<DiscordLogo className="h-4" />}
										>
											{discordUsername ? "Verified" : "Sign In"}
										</Button>
									</div>
								}
							/>
						</div>
					</fieldset>

					<fieldset className="mt-16 text-center">
						<Button type="submit" className="w-1/3 text-center" disabled={open}>
							<div className="flex items-center justify-center">
								<span>Sign and Submit</span>
							</div>
						</Button>
						<p className="mt-2 text-sm">Estimated gas fee 2 CPAY</p>
					</fieldset>

					<input
						type="hidden"
						name="twitterRegistrarIndex"
						value={twitterRegistrarIndex}
					/>
					<input
						type="hidden"
						name="discordRegistrarIndex"
						value={discordRegistrarIndex}
					/>
				</form>
			</div>

			<TransactionDialog open={open} onClose={onDialogClose}>
				<Choose>
					<Choose.When condition={formState?.status === "Ok"}>
						<CheckCircle className="text-hero mb-2 h-12 w-12  flex-shrink-0" />
						<div className="font-display text-hero mb-4 text-2xl uppercase">
							Success!
						</div>
						<p className="text-center">
							Your identity has been set successfully, [and maybe some message
							about a role has been granted, visit Discord].
						</p>
						<div className="mt-8 flex w-full flex-col items-center justify-center text-center">
							<div className="mb-4">
								<Button startAdornment={<DiscordLogo className="h-4" />}>
									Join Our Discord
								</Button>
							</div>

							<div>
								<Button
									onClick={onDismissClick}
									variant="white"
									className="w-28"
								>
									Dismiss
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
							<Button onClick={onDismissClick} className="w-28">
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
							Providing Judgement [3/3]
						</div>
						<p className="text-center">
							Please wait until this proccess completes...
						</p>
					</Choose.When>
				</Choose>
			</TransactionDialog>
		</Layout>
	);
};

export default Connect;
