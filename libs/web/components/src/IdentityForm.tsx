import { FC } from "react";
import { classNames } from "react-extras";

import { IntrinsicElements } from "@app-gov/web/utils";

import { Button, IdentityFieldSet, Layout, useIdentity } from "./";

interface IdentityFormProps {
	open: boolean;
}

export const IdentityForm: FC<
	Omit<IntrinsicElements["form"], "parent"> & IdentityFormProps
> = ({ open, ...props }) => {
	const { twitterRegistrarIndex, discordRegistrarIndex, identityCheck } =
		useIdentity();

	return (
		<form {...props}>
			<Layout.PageHeader>Set your identity</Layout.PageHeader>

			<p className="prose mb-[1.5em] text-lg">
				The Identity Module ensures an authentic governance and voting
				experience. It does this by requiring every voting wallet to be
				connected to 2 social accounts.
			</p>

			<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
				Connect your wallet
			</h2>
			<p className="prose mb-[1em] text-base">
				Connect your voting wallet here. This is the wallet that will be checked
				against the staking requirement. If you have a controller wallet with a
				stash account that is actively staking, you may connect your controller
				wallet.
			</p>
			<fieldset
				className={classNames("mb-12 min-w-0", identityCheck && "space-y-4")}
			>
				<IdentityFieldSet.Account />
			</fieldset>

			<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
				Connect your social channels
			</h2>
			<p className="prose mb-[1em] text-base">
				Signing into your social accounts below will establish that you are the
				owner of the accounts and will allow your wallet to participate in
				Governance. After seeing both the ‘Verified Twitter’ and ‘Verified
				Discord’ icons, sign and submit the transaction to send this information
				to the blockchain. If you wish to change the social accounts connected
				to your wallet, simply connect the same wallet address, but sign into
				different social accounts.
			</p>
			<fieldset className="mb-12">
				<div className="grid grid-cols-2 items-center gap-4">
					<IdentityFieldSet.Twitter />

					<IdentityFieldSet.Discord />
				</div>
			</fieldset>

			<fieldset className="mt-16 text-center">
				<Button type="submit" className="w-1/3 text-center" disabled={open}>
					<span>Sign and Submit</span>
				</Button>
				<p className="mt-2 text-sm">Estimated gas fee 2 CPAY</p>
			</fieldset>

			<input
				type="hidden"
				name="twitterRegistrarIndex"
				value={twitterRegistrarIndex}
			/>
			<input
				type="hidden"
				name="discordRegistrarIndex"
				value={discordRegistrarIndex}
			/>
		</form>
	);
};
