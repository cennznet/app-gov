import { Api } from "@cennznet/api";
import { KeyringPair } from "@polkadot/keyring/types";

import {
	fetchIdentityRegistrars,
	getKeyringPairFromSeed,
} from "@app-gov/service/cennznet";
import {
	DISCORD_REGISTRAR_SEED,
	TWITTER_REGISTRAR_SEED,
} from "@app-gov/service/env-vars";

interface Registrar {
	address: string;
	index: number;
	signer: KeyringPair;
}

export const fetchRequiredRegistrars = async (
	api: Api
): Promise<Record<"discord" | "twitter", Registrar>> => {
	const registrars = await fetchIdentityRegistrars(api);
	const twitterRegistrar = getKeyringPairFromSeed(TWITTER_REGISTRAR_SEED);
	const discordRegistrar = getKeyringPairFromSeed(DISCORD_REGISTRAR_SEED);

	return registrars.reduce((output, registrar, index) => {
		if (registrar.account === twitterRegistrar.address) {
			output.twitter = {
				index,
				address: twitterRegistrar.address,
				signer: twitterRegistrar,
			};
		}

		if (registrar.account === discordRegistrar.address) {
			output.discord = {
				index,
				address: discordRegistrar.address,
				signer: discordRegistrar,
			};
		}

		return output;
	}, {} as Record<"discord" | "twitter", Registrar>);
};
