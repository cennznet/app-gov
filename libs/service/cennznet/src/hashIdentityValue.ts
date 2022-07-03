import { blake2AsHex } from "@polkadot/util-crypto";

export interface IdentityHash {
	blakeTwo256: string;
}

export const hasIdentityValue = (value: string): IdentityHash => {
	return { blakeTwo256: blake2AsHex(value) };
};

export const isIdentityValueMatched = (
	value: string,
	hash: IdentityHash
): boolean => {
	return blake2AsHex(value) === hash.blakeTwo256;
};
