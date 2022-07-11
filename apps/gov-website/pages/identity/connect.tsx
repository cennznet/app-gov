import type { GetStaticProps, NextPage } from "next";
import {
	FC,
	FormEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import { fetchRequiredRegistrars } from "@app-gov/node/utils";
import { getApiInstance } from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	Header,
	IdentityFieldSet,
	IdentityForm,
	IdentityFormDialog,
	Layout,
	useTransactionDialog,
} from "@app-gov/web/components";
import { useIdentityConnectForm } from "@app-gov/web/hooks";

interface StaticProps {
	twitterRegistrarIndex: number;
	discordRegistrarIndex: number;
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);
	const { twitter, discord } = await fetchRequiredRegistrars(api);

	return {
		props: {
			twitterRegistrarIndex: twitter.index,
			discordRegistrarIndex: discord.index,
		},
	};
};

const Connect: NextPage<StaticProps> = ({
	twitterRegistrarIndex,
	discordRegistrarIndex,
}) => {
	return (
		<Layout>
			<Header />
			<IdentityFieldSet.Provider
				twitterRegistrarIndex={twitterRegistrarIndex}
				discordRegistrarIndex={discordRegistrarIndex}
			>
				<ConnectComponent />
			</IdentityFieldSet.Provider>
		</Layout>
	);
};

export default Connect;

const ConnectComponent: FC = () => {
	const { submitForm, formState, resetFormState } = useIdentityConnectForm();
	const { open, openDialog, closeDialog } = useTransactionDialog();
	const { clearTwitterUsername, clearDiscordUsername } = useContext(
		IdentityFieldSet.Context
	);

	const [formKey, setFormKey] = useState<string>(`IdentityForm${Date.now()}`);
	const resetForm = () => setFormKey(`IdentityForm${Date.now()}`);

	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
			openDialog();
			submitForm(new FormData(event.target as HTMLFormElement));
		},
		[openDialog, submitForm]
	);

	const onDialogDismiss = useCallback(() => {
		closeDialog();
		clearTwitterUsername();
		clearDiscordUsername();
		setTimeout(() => {
			resetForm();
			resetFormState();
		}, 200);
	}, [clearDiscordUsername, clearTwitterUsername, closeDialog, resetFormState]);

	useEffect(() => {
		if (formState?.status === "Cancelled") closeDialog();
	}, [closeDialog, formState]);

	const onDialogClose = useCallback(() => {
		if (formState?.status === "Cancelled") return;
		onDialogDismiss();
	}, [onDialogDismiss, formState?.status]);

	return (
		<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
			<IdentityForm open={open} onSubmit={onFormSubmit} key={formKey} />

			<IdentityFormDialog
				open={open}
				formState={formState}
				onClose={onDialogClose}
				onDismiss={onDialogDismiss}
			/>
		</div>
	);
};
