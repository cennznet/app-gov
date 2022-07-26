import { ComponentProps, FC, useCallback, useRef, useState } from "react";

import { Dialog } from "./";

export interface TransactionDialogProps extends ComponentProps<typeof Dialog> {}

export const TransactionDialog: FC<TransactionDialogProps> = ({
	children,
	...props
}) => {
	const focusElement = useRef(null);

	return (
		<Dialog {...props} initialFocus={focusElement} panelClassName="min-w-fit">
			<div
				ref={focusElement}
				className="border-hero bg-light shadow-sharp shadow-hero/40 flex  h-full flex-col items-center justify-center border-4 p-8"
			>
				{children}
			</div>
		</Dialog>
	);
};

export const useTransactionDialog = () => {
	const [open, setOpen] = useState<boolean>(false);

	const openDialog = useCallback(() => {
		setOpen(true);
	}, []);

	const closeDialog = useCallback(() => {
		setOpen(false);
	}, []);

	return { open, openDialog, closeDialog };
};
