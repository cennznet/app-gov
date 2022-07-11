import {
	createContext,
	FC,
	MouseEventHandler,
	useCallback,
	useContext,
} from "react";
import { If } from "react-extras";

import { useSocialSignIn } from "@app-gov/web/hooks";
import { PropsWithChildren } from "@app-gov/web/types";
import { DiscordLogo, TwitterLogo, X } from "@app-gov/web/vectors";

import { Button, TextField } from "./";

interface ContextType {
	twitterUsername: string;
	clearTwitterUsername: () => void;
	onTwitterSignInClick: MouseEventHandler<HTMLButtonElement>;
	twitterRegistrarIndex: number;

	discordUsername: string;
	clearDiscordUsername: () => void;
	onDiscordSignInClick: MouseEventHandler<HTMLButtonElement>;
	discordRegistrarIndex: number;
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

const useOnNoop = () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return useCallback(() => {}, []);
};

export const IdentityContext = {
	Provider,
	Discord,
	Twitter,
	Context,
};
