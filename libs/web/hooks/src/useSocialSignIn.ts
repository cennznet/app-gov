import { MouseEventHandler, useCallback, useState } from "react";
import { getSession } from "next-auth/react";
import { useWindowPopup } from "./useWindowPopup";

export const useSocialSignIn = (provider: "Twitter" | "Discord") => {
	const popupWindow = useWindowPopup();
	const [username, setUsername] = useState<string>("");
	const onSignInClick: MouseEventHandler<HTMLButtonElement> =
		useCallback(async () => {
			setTimeout(() => {
				popupWindow(
					`/popup/signin?provider=${provider.toLowerCase()}`,
					`${provider}Auth`
				);
			}, 100);

			const onStorageEvent = async (event: StorageEvent) => {
				if (event.key !== "nextauth.message") return;
				const { url } = event;
				if (url.indexOf(`provider=${provider.toLowerCase()}&callback=1`) < 0)
					return;

				const session = await getSession();
				const [sessionProvider, username] = session?.user?.name?.split(
					"://"
				) ?? [null, null];
				if (provider.toLowerCase() !== sessionProvider) return;

				window.removeEventListener("storage", onStorageEvent);
				setUsername(username ?? "");
			};

			window.addEventListener("storage", onStorageEvent);
		}, [popupWindow, provider]);

	const clearUsername = useCallback(() => {
		setUsername("");
	}, []);

	return { onSignInClick, username, clearUsername };
};
