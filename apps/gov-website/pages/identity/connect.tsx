import type { NextPage } from "next";
import {
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from "react";
import {
  DiscordLogo,
  TwitterLogo,
  Spinner,
  CloseIcon,
} from "@gov-app/libs/assets/vectors";
import { useWindowPopup } from "@gov-app/libs/hooks/useWindowPopup";
import { getSession } from "next-auth/react";
import { If } from "react-extras";
import {
  Button,
  TextField,
  WalletSelect,
  Layout,
  Header,
} from "@gov-app/libs/components";
import { submitIdentityConnectForm } from "@gov-app/libs/utils/submitIdentityConnectForm";
import { useCENNZApi } from "@gov-app/libs/providers/CENNZApiProvider";

const Connect: NextPage = () => {
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

  const { busy, onFormSubmit } = useFormSubmit();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onTextInput = useCallback(() => {}, []);

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
                required
                name="twitterUsername"
                value={twitterUsername}
                onInput={onTextInput}
                endAdornment={
                  <div className="flex items-center">
                    <If condition={!!twitterUsername}>
                      <div
                        className="hover:text-hero mr-2 cursor-pointer transition-colors"
                        onClick={clearTwitterUsername}
                      >
                        <CloseIcon />
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
                required
                name="discordUsername"
                value={discordUsername}
                onInput={onTextInput}
                endAdornment={
                  <div className="flex items-center">
                    <If condition={!!discordUsername}>
                      <div
                        className="hover:text-hero mr-2 cursor-pointer transition-colors"
                        onClick={clearDiscordUsername}
                      >
                        <CloseIcon />
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
            <Button type="submit" className="w-1/3 text-center" disabled={busy}>
              <div className="flex items-center justify-center">
                <If condition={busy}>
                  <span className="mr-2">
                    <Spinner />
                  </span>
                </If>
                <span>{busy ? "Processing..." : "Sign and Submit"}</span>
              </div>
            </Button>
            <p className="mt-2 text-sm">Estimated gas fee 2 CPAY</p>
          </fieldset>
        </form>
      </div>
    </Layout>
  );
};

export default Connect;

const useSocialSignIn = (provider: "Twitter" | "Discord") => {
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
        setUsername(username);
      };

      window.addEventListener("storage", onStorageEvent);
    }, [popupWindow, provider]);

  const clearUsername = useCallback(() => {
    setUsername("");
  }, []);

  return { onSignInClick, username, clearUsername };
};

const useFormSubmit = () => {
  const { api } = useCENNZApi();
  const [busy, setBusy] = useState<boolean>(false);
  const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      setBusy(true);

      const data = new FormData(event.target as HTMLFormElement);

      try {
        await submitIdentityConnectForm(api, {
          address: data.get("address") as string,
          twitterUsername: data.get("twitterUsername") as string,
          discordUsername: data.get("discordUsername") as string,
        }).finally(() => {
          setBusy(false);
        });
      } catch (error) {
        console.info(error);
      }
    },
    [api]
  );

  return { busy, onFormSubmit };
};
