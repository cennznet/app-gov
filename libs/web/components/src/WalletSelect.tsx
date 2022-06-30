import type { ChangeEventHandler, MouseEventHandler } from "react";

import { Button, Select } from "@app-gov/web/components";
import { useCENNZWallet, useCENNZExtension } from "@app-gov/web/providers";
import { CENNZLogo } from "@app-gov/web/vectors";

export const WalletSelect: typeof Select = (props) => {
	const {
		onCENNZConnectClick,
		onCENNZAccountSelect,
		allAccounts,
		selectedAccount,
	} = useCENNZConnect();

	return (
		<Select
			placeholder="Connect CENNZnet Wallet"
			inputClassName="!py-4"
			defaultValue={selectedAccount}
			onChange={onCENNZAccountSelect}
			endAdornment={
				<Button
					active={!!selectedAccount}
					size="small"
					onMouseDown={onCENNZConnectClick}
					startAdornment={<CENNZLogo className="h-4" />}
				>
					{!!selectedAccount && "Connected"}
					{!selectedAccount && "Connect"}
				</Button>
			}
			{...props}
		>
			{allAccounts?.map((account, index) => (
				<option value={account} key={index}>
					{account}
				</option>
			))}
		</Select>
	);
};

const useCENNZConnect = () => {
	const { accounts } = useCENNZExtension();
	const { connectWallet, selectedAccount, selectAccount } = useCENNZWallet();

	const allAccounts = accounts
		?.map((account) => account?.address)
		.filter(Boolean);

	const onCENNZConnectClick: MouseEventHandler<HTMLButtonElement> = () =>
		connectWallet();

	const onCENNZAccountSelect: ChangeEventHandler<HTMLSelectElement> = (
		event
	) => {
		const address = event.target.value;
		const item = accounts?.find((account) => account.address === address);

		if (item) selectAccount(item);
	};

	return {
		onCENNZConnectClick,
		onCENNZAccountSelect,
		allAccounts,
		selectedAccount: selectedAccount?.address,
	};
};