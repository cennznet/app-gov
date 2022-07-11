import type { AnyTuple } from "@cennznet/types";
import type { Option } from "@polkadot/types-codec";
import type { IdentityInfo } from "@polkadot/types/interfaces";
import {
	createContext,
	FC,
	MouseEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { If } from "react-extras";

import { useSocialSignIn } from "@app-gov/web/hooks";
import { useCENNZApi, useCENNZWallet } from "@app-gov/web/providers";
import { PropsWithChildren } from "@app-gov/web/types";
import { DiscordLogo, TwitterLogo, WarningIcon, X } from "@app-gov/web/vectors";

import { AccountSelect, Button, TextField } from "./";

interface IdentityCheck {
	identitySet?: boolean;
	judgementProvided?: boolean;
}

interface ContextType {
	twitterUsername: string;
	clearTwitterUsername: () => void;
	onTwitterSignInClick: MouseEventHandler<HTMLButtonElement>;
	twitterRegistrarIndex: number;

	discordUsername: string;
	clearDiscordUsername: () => void;
	onDiscordSignInClick: MouseEventHandler<HTMLButtonElement>;
	discordRegistrarIndex: number;

	identityCheck: IdentityCheck | undefined;
}

interface ProviderProps extends PropsWithChildren {
	twitterRegistrarIndex: number;
	discordRegistrarIndex: number;
}

const Context = createContext({} as ContextType);

const Provider: FC<ProviderProps> = ({
	twitterRegistrarIndex,
	discordRegistrarIndex,
	children,
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

	const { api } = useCENNZApi();
	const { selectedAccount } = useCENNZWallet();
	const [identityCheck, setIdentityCheck] = useState<IdentityCheck>();

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
	}, [api, selectedAccount?.address]);

	return (
		<Context.Provider
			value={{
				twitterUsername,
				clearTwitterUsername,
				onTwitterSignInClick,
				twitterRegistrarIndex,

				discordUsername,
				clearDiscordUsername,
				onDiscordSignInClick,
				discordRegistrarIndex,

				identityCheck,
			}}
		>
			{children}
		</Context.Provider>
	);
};

const Discord: FC = () => {
	const { discordUsername, clearDiscordUsername, onDiscordSignInClick } =
		useContext(Context);
	const onNoop = useOnNoop();

	return (
		<TextField
			placeholder="Sign-in to verify"
			inputClassName="!py-3"
			name="discordUsername"
			value={discordUsername}
			onChange={onNoop}
			// required
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
		useContext(Context);
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

const Account: FC = () => {
	const { identityCheck } = useContext(Context);

	return (
		<>
			<AccountSelect required name="address" />
			<If condition={!!identityCheck}>
				<div className="items-center">
					<div className="text-hero float-left m-px inline p-2">
						<WarningIcon className="h-6 w-6" />
					</div>
					<p className="prose text-xs">
						<If condition={!!identityCheck?.identitySet}>
							This account already has a registered identity. Connecting your
							social channels will overwrite the previously registered channels.
						</If>
						<If condition={!!identityCheck?.judgementProvided}>
							This account already has judgements provided on its identity.
							Connecting your social channels will remove the previous
							judgements.
						</If>
					</p>
				</div>
			</If>
		</>
	);
};

const useOnNoop = () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return useCallback(() => {}, []);
};

export const IdentityFieldSet = {
	Provider,
	Context,
	Account,
	Discord,
	Twitter,
};
