export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET ?? "";

export const TWITTER_REGISTRAR_SEED: Uint8Array = (process.env
	.TWITTER_REGISTRAR_SEED ?? "") as unknown as Uint8Array;

export const DISCORD_REGISTRAR_SEED: Uint8Array = (process.env
	.DISCORD_REGISTRAR_SEED ?? "") as unknown as Uint8Array;
