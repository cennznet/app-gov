import type {
	ChangeEventHandler,
	ComponentProps,
	MouseEventHandler,
} from "react";
import { forwardRef } from "react";

import { useCENNZExtension, useCENNZWallet } from "@app-gov/web/providers";
import { CENNZLogo } from "@app-gov/web/vectors";

import { Button, Select } from "./";

type SelectProps = ComponentProps<typeof Select>;

export const AccountSelect = forwardRef<HTMLSelectElement, SelectProps>(
	(props, ref) => {
		const { onConnectClick, onAccountSelect, allAccounts, selectedAccount } =
			useCENNZConnect();

		return (
			<Select
				ref={ref}
				placeholder="Connect CENNZnet Wallet"
				inputClassName="!py-[0.875rem]"
				value={selectedAccount}
				onChange={onAccountSelect}
				required
				endAdornment={
					<Button
						active={!!selectedAccount}
						size="small"
						onMouseDown={onConnectClick}
						startAdornment={<CENNZLogo className="h-4" />}
					>
						{!!selectedAccount && "Connected"}
						{!selectedAccount && "Connect"}
					</Button>
				}
				{...props}
			>
				{!!selectedAccount &&
					allAccounts?.map((account, index) => (
						<option value={account.address} key={index}>
							{`${account.meta.name} - ${account.address
								.slice(0, 8)
								.concat("...", account.address.slice(-8))}`}
						</option>
					))}
			</Select>
		);
	}
);

const useCENNZConnect = () => {
	const { accounts } = useCENNZExtension();
	const { connectWallet, selectedAccount, selectAccount } = useCENNZWallet();

	const allAccounts = accounts?.filter(Boolean);

	const onConnectClick: MouseEventHandler<HTMLButtonElement> = () =>
		connectWallet();

	const onAccountSelect: ChangeEventHandler<HTMLSelectElement> = (event) => {
		const address = event.target.value;
		const item = accounts?.find((account) => account.address === address);

		if (item) selectAccount(item);
	};

	return {
		onConnectClick,
		onAccountSelect,
		allAccounts,
		selectedAccount: selectedAccount?.address,
	};
};
