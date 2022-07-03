import Keyring from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";

export const getKeyringPairFromSeed = (seed: Uint8Array): KeyringPair => {
	return new Keyring({ type: "sr25519" }).addFromSeed(seed);
};
