import { AnyTuple } from "@cennznet/types";
import type { Option } from "@polkadot/types-codec";
import type { IdentityInfo } from "@polkadot/types/interfaces";
import type { GetStaticProps, NextPage } from "next";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { classNames, If } from "react-extras";

import { fetchRequiredRegistrars } from "@app-gov/node/utils";
import { getApiInstance } from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	AccountSelect,
	Button,
	Header,
	IdentityFormDialog,
	Layout,
	TextField,
	useTransactionDialog,
} from "@app-gov/web/components";
import { useIdentityConnectForm, useSocialSignIn } from "@app-gov/web/hooks";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";
import { DiscordLogo, TwitterLogo, WarningIcon, X } from "@app-gov/web/vectors";

interface StaticProps {
	twitterRegistrarIndex: number;
	discordRegistrarIndex: number;
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
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

	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
			openDialog();
			submitForm(new FormData(event.target as HTMLFormElement));
		},
		[openDialog, submitForm]
	);

	const onDialogDismiss = useCallback(() => {
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
		onDialogDismiss();
	}, [onDialogDismiss, formState?.status]);

	const identityCheck = useIdentityCheck();

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<form onSubmit={onFormSubmit}>
					<h1 className="font-display text-hero mb-8 text-center text-7xl uppercase">
						Set your identity
					</h1>

					<p className="prose mb-8 text-lg">
						The Identity Module ensures an authentic governance and voting
						experience. It does this by requiring every voting wallet to be
						connected to 2 social accounts.
					</p>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your wallet
					</h2>
					<p className="prose mb-8">
						Connect your voting wallet here. This is the wallet that will be
						checked against the staking requirement. If you have a controller
						wallet with a stash account that is actively staking, you may
						connect your controller wallet.
					</p>
					<fieldset
						className={classNames(
							"mb-12 min-w-0",
							identityCheck && "space-y-4"
						)}
					>
						<AccountSelect required name="address" />
						<If condition={!!identityCheck}>
							<div className="text-hero float-left inline p-[0.1875rem] pb-0">
								<WarningIcon className="h-6 w-6" />
							</div>
							<p className="prose text-sm leading-7">
								<If condition={identityCheck?.identitySet}>
									This account already has a registered identity. Connecting
									your social channels will overwrite the previously registered
									channels.
								</If>
								<If condition={identityCheck?.judgementProvided}>
									This account already has judgements provided on its identity.
									Connecting your social channels will remove the previous
									judgements.
								</If>
							</p>
						</If>
					</fieldset>

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your social channels
					</h2>
					<p className="prose mb-8">
						If your wallet is yet to be associated with a social account, you
						will be able to sign in to Twitter and Discord below. This will
						establish that you are the owner of the social accounts and
						therefore a real individual. After seeing both the ‘Verified
						Twitter’ and ‘Verified Discord’ icons, sign and submit the
						transaction to send this information to the blockchain.
					</p>
					<fieldset className="mb-12">
						<div className="grid grid-cols-2 items-center gap-4">
							<TextField
								placeholder="Sign-in to verify"
								inputClassName="!py-3"
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
												<X className="h-4 w-4" />
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
								inputClassName="!py-3"
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
												<X className="h-4 w-4" />
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

			<IdentityFormDialog
				open={open}
				formState={formState}
				onClose={onDialogClose}
				onDismiss={onDialogDismiss}
			/>
		</Layout>
	);
};

export default Connect;

const useIdentityCheck = () => {
	const { api } = useCENNZApi();
	const { selectedAccount } = useCENNZWallet();
	const [identityCheck, setIdentityCheck] = useState<{
		identitySet?: boolean;
		judgementProvided?: boolean;
	}>();

	useEffect(() => {
		if (!api || !selectedAccount?.address) return;

		const checkIdentity = async () => {
			const identity = (await api.query.identity.identityOf(
				selectedAccount.address
			)) as Option<IdentityInfo>;

			if (!identity.isSome) return setIdentityCheck(undefined);

			const prevIdentity = identity.toJSON() as unknown as {
				judgements: AnyTuple[];
			};

			if (prevIdentity?.judgements.length)
				return setIdentityCheck({ judgementProvided: true });

			setIdentityCheck({ identitySet: true });
		};

		checkIdentity();
	}, [selectedAccount?.address, api]);

	return identityCheck;
};
