import type { AnyTuple } from "@cennznet/types";
import type { Option } from "@polkadot/types-codec";
import type { IdentityInfo } from "@polkadot/types/interfaces";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { classNames, If } from "react-extras";

import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";
import { DiscordLogo, TwitterLogo, WarningIcon, X } from "@app-gov/web/vectors";

import { AccountSelect, Button, IdentityContext, TextField } from "./";

const Discord: FC = () => {
	const { discordUsername, clearDiscordUsername, onDiscordSignInClick } =
		useContext(IdentityContext.Context);
	const onNoop = useOnNoop();

	return (
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
	);
};

const Twitter: FC = () => {
	const { twitterUsername, clearTwitterUsername, onTwitterSignInClick } =
		useContext(IdentityContext.Context);
	const onNoop = useOnNoop();

	return (
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
	);
};

const Channels: FC = () => (
	<fieldset className="mb-12">
		<div className="grid grid-cols-2 items-center gap-4">
			<Twitter />

			<Discord />
		</div>
	</fieldset>
);

const Connect: FC = () => {
	const identityCheck = useIdentityCheck();

	return (
		<fieldset
			className={classNames("mb-12 min-w-0", identityCheck && "space-y-4")}
		>
			<AccountSelect required name="address" />
			<If condition={!!identityCheck}>
				<div className="text-hero float-left inline p-[0.1875rem] pb-0">
					<WarningIcon className="h-6 w-6" />
				</div>
				<p className="prose text-sm leading-7">
					<If condition={!!identityCheck?.identitySet}>
						This account already has a registered identity. Connecting your
						social channels will overwrite the previously registered channels.
					</If>
					<If condition={!!identityCheck?.judgementProvided}>
						This account already has judgements provided on its identity.
						Connecting your social channels will remove the previous judgements.
					</If>
				</p>
			</If>
		</fieldset>
	);
};

const useOnNoop = () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return useCallback(() => {}, []);
};

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

export const IdentityFieldSet = {
	Connect,
	Channels,
};
