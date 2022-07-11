import { createContext, FC, MouseEventHandler } from "react";

import { useSocialSignIn } from "@app-gov/web/hooks";
import { PropsWithChildren } from "@app-gov/web/types";

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

export const IdentityContext = {
	Provider,
	Context,
};
