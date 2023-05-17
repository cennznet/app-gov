import { CENNZNetNetwork } from "@cennznet/api/types";
import { OAuthUserConfig } from "next-auth/providers";

import { getNetworkDetails, NetworkDetails } from "@app-gov/service/cennznet";

// MONGODB
export const MONGODB_URI: string =
	process.env.MONGODB_URI ?? "mongodb://root:root@localhost:27017/admin";

// CENNZNET
export const CENNZ_NETWORK: NetworkDetails = getNetworkDetails(
	(process.env.NX_CENNZ_NETWORK ?? "rata") as CENNZNetNetwork
);
export const TWITTER_REGISTRAR_SEED: Uint8Array = (process.env
	.TWITTER_REGISTRAR_SEED ?? "") as unknown as Uint8Array;
export const DISCORD_REGISTRAR_SEED: Uint8Array = (process.env
	.DISCORD_REGISTRAR_SEED ?? "") as unknown as Uint8Array;

// PINATA
export const PINATA_JWT: string = process.env.NX_PINATA_JWT ?? "";
export const PINATA_GATEWAY: string = process.env.NX_PINATA_GATEWAY ?? "";

// DISCORD
export const DISCORD_WEBSITE_BOT = {
	Token: process.env.DISCORD_BOT_TOKEN ?? "",
	ServerId: process.env.NX_DISCORD_SERVER_ID ?? "",
	IdentityRoleId: process.env.DISCORD_IDENTITY_ROLE_ID ?? "",
};
export const DISCORD_RELAYER_BOT = {
	Token: process.env.DISCORD_BOT_TOKEN ?? "",
	ProposalWebhookId: process.env.DISCORD_PROPOSAL_WEBHOOK_ID ?? "",
	ReferendumWebhookId: process.env.DISCORD_REFERENDUM_WEBHOOK_ID ?? "",
};
export const DISCORD_CHANNEL_IDS: string[] = [
	process.env.NX_DISCORD_PROPOSAL_CHANNEL_ID ?? "",
	process.env.NX_DISCORD_REFERENDUM_CHANNEL_ID ?? "",
];
export const DISCORD_WEBHOOK_IDS: string[] = [
	DISCORD_RELAYER_BOT.ProposalWebhookId,
	DISCORD_RELAYER_BOT.ReferendumWebhookId,
];

// GOV-WEBSITE
export const DISCORD_CLIENT: Pick<
	OAuthUserConfig<"discord">,
	"clientId" | "clientSecret"
> = {
	clientId: process.env.DISCORD_CLIENT_ID ?? "",
	clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
};
export const TWITTER_CLIENT: Pick<
	OAuthUserConfig<"twitter">,
	"clientId" | "clientSecret"
> = {
	clientId: process.env.TWITTER_CLIENT_ID ?? "",
	clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
};
export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET ?? "";

// GOV-RELAYER
export const BLOCK_POLLING_INTERVAL = Number(
	process.env.BLOCK_POLLING_INTERVAL || 2
);
export const PROPOSAL_QUEUE = `${CENNZ_NETWORK.ChainSlug}_AppGov_Proposal`;
export const MESSAGE_TIMEOUT = Number(process.env.MESSAGE_TIMEOUT || 10000);
export const MESSAGE_MAX_RETRY = Number(process.env.MESSAGE_MAX_RETRY || 5);
export const PROPOSAL_URL: string =
	process.env.NX_PROPOSAL_URL ?? "http://localhost:4200";

export const REVALIDATE_SECRET: string = process.env.REVALIDATE_SECRET ?? "";
