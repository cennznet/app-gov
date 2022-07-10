import type { GetStaticProps, NextPage } from "next";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

import {
	extractCallableExtrinsics,
	getApiInstance,
} from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import {
	FunctionCallFieldSet,
	Header,
	Layout,
	ProposalNewForm,
	ProposalNewFormDialog,
	useTransactionDialog,
} from "@app-gov/web/components";
import { useProposalNewForm } from "@app-gov/web/hooks";

interface NewProposalProps {
	extrinsics: Awaited<ReturnType<typeof extractCallableExtrinsics>>;
}

export const getStaticProps: GetStaticProps<NewProposalProps> = async () => {
	const api = await getApiInstance(CENNZ_NETWORK.ChainSlug);
	const extrinsics = await extractCallableExtrinsics(api);
	return {
		props: {
			extrinsics,
		},
	};
};

const NewProposal: NextPage<NewProposalProps> = ({ extrinsics }) => {
	const { submitForm, formState } = useProposalNewForm();
	const [formKey, setFormKey] = useState<string>(`PrposalNewForm${Date.now()}`);
	const { open, openDialog, closeDialog } = useTransactionDialog();

	const resetForm = () => setFormKey(`PrposalNewForm${Date.now()}`);

	const onFormSubmit: ChangeEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
			openDialog();
			submitForm(new FormData(event.target));
		},
		[openDialog, submitForm]
	);

	const onDialogDismiss = useCallback(() => {
		closeDialog();

		setTimeout(resetForm, 200);
	}, [closeDialog]);

	const onDialogClose = useCallback(() => {
		if (formState?.status === "Cancelled") return;
		onDialogDismiss();
	}, [formState?.status, onDialogDismiss]);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display text-hero mb-8 text-center text-7xl uppercase">
					Submit a Proposal
				</h1>

				<p className="mb-8 text-lg">
					To submit a proposal you must be a CENNZnet Councillor. Lorem laborum
					dolor minim mollit eu reprehenderit culpa dolore labore dolor mollit
					commodo do anim incididunt sunt id pariatur elit tempor nostrud nulla
					eu proident ut id qui incididunt.
				</p>
				<FunctionCallFieldSet.Provider extrinsics={extrinsics}>
					<ProposalNewForm onSubmit={onFormSubmit} key={formKey} />
				</FunctionCallFieldSet.Provider>

				<ProposalNewFormDialog
					open={open}
					formState={formState}
					onClose={onDialogClose}
					onDismiss={onDialogDismiss}
				/>
			</div>
		</Layout>
	);
};

export default NewProposal;
