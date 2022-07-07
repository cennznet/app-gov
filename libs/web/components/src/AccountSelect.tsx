import type {
	ChangeEventHandler,
	ComponentProps,
	FC,
	MouseEventHandler,
} from "react";

import { useCENNZExtension, useCENNZWallet } from "@app-gov/web/providers";
import { CENNZLogo } from "@app-gov/web/vectors";

import { Button, Select } from "./";

type SelectProps = ComponentProps<typeof Select>;

export const AccountSelect: FC<SelectProps> = (props) => {
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
};

const useCENNZConnect = () => {
	const { accounts } = useCENNZExtension();
	const { connectWallet, selectedAccount, selectAccount } = useCENNZWallet();

	const allAccounts = accounts?.filter(Boolean);

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
