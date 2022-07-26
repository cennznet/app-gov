import type { GetStaticProps, NextPage } from "next";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

import {
	extractCallableExtrinsics,
	getApiInstance,
} from "@app-gov/service/cennznet";
import { CENNZ_NETWORK } from "@app-gov/service/env-vars";
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
	const [formKey, setFormKey] = useState<string>(
		`ProposalNewForm${Date.now()}`
	);
	const { open, openDialog, closeDialog } = useTransactionDialog();

	const resetForm = () => setFormKey(`ProposalNewForm${Date.now()}`);

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

	useEffect(() => {
		if (formState?.status === "Cancelled") closeDialog();
	}, [closeDialog, formState]);

	const onDialogClose = useCallback(() => {
		if (!formState?.status || formState?.status === "Cancelled") return;
		onDialogDismiss();
	}, [onDialogDismiss, formState?.status]);

	return (
		<Layout.PageWrapper>
			<Header />
			<Layout.PageContent>
				<Layout.PageHeader>Submit a Proposal</Layout.PageHeader>

				<div className="mb-[1.5em] space-y-2">
					<p className="prose text-lg">
						Councillors are allowed to submit proposals, which are made up of
						three sections.
					</p>

					<ol className="prose -ml-2 list-decimal text-lg">
						<li>
							<em className="pr-px">Justification:</em> Flexible space for brief
							descriptions, partial or full code changes, links to external
							material
						</li>
						<li>
							<em className="pr-px">Enactment delay:</em> The amount of time
							that must pass after the referendum stage, before changes are
							enacted
						</li>
						<li>
							<em className="pr-px">Function call (optional):</em> Use one of
							the preset function calls for quick commands
						</li>
					</ol>
				</div>

				<FunctionCallFieldSet.Provider extrinsics={extrinsics}>
					<ProposalNewForm onSubmit={onFormSubmit} key={formKey} />
				</FunctionCallFieldSet.Provider>

				<ProposalNewFormDialog
					open={open}
					formState={formState}
					onClose={onDialogClose}
					onDismiss={onDialogDismiss}
				/>
			</Layout.PageContent>
		</Layout.PageWrapper>
	);
};

export default NewProposal;
