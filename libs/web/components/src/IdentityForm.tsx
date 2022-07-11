import { FC, useContext } from "react";

import { IntrinsicElements } from "@app-gov/web/types";

import { Button, IdentityContext, IdentityFieldSet } from "./";

interface IdentityFormProps {
	open: boolean;
}

export const IdentityForm: FC<
	Omit<IntrinsicElements["form"], "parent"> & IdentityFormProps
> = ({ open, ...props }) => {
	const { twitterRegistrarIndex, discordRegistrarIndex } = useContext(
		IdentityContext.Context
	);

	return (
		<form {...props}>
			<h1 className="font-display text-hero mb-8 text-center text-7xl uppercase">
				Set your identity
			</h1>

			<p className="prose mb-8 text-lg">
				The Identity Module ensures an authentic governance and voting
				experience. It does this by requiring every voting wallet to be
				connected to 2 social accounts.
			</p>

			<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
				Connect your wallet
			</h2>
			<p className="prose mb-8">
				Connect your voting wallet here. This is the wallet that will be checked
				against the staking requirement. If you have a controller wallet with a
				stash account that is actively staking, you may connect your controller
				wallet.
			</p>
			<IdentityFieldSet.Connect />

			<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
				Connect your social channels
			</h2>
			<p className="prose mb-8">
				If your wallet is yet to be associated with a social account, you will
				be able to sign in to Twitter and Discord below. This will establish
				that you are the owner of the social accounts and therefore a real
				individual. After seeing both the ‘Verified Twitter’ and ‘Verified
				Discord’ icons, sign and submit the transaction to send this information
				to the blockchain.
			</p>
			<IdentityFieldSet.Channels />

			<fieldset className="mt-16 text-center">
				<Button type="submit" className="w-1/3 text-center" disabled={open}>
					<div className="flex items-center justify-center">
						<span>Sign and Submit</span>
					</div>
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
