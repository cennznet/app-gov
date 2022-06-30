import type { TxStatus, TxType } from "@app-gov/web/types";

import { useCallback, useState } from "react";

export interface TxStatusHook {
	txStatus: TxStatus | undefined;
	setTxIdle: (props?: any) => void;
	setTxPending: (props?: any) => void;
	setTxFailure: (props?: any) => void;
	setTxSuccess: (props?: any) => void;
}

export const useTxStatus = (defaultValue: TxStatus | undefined = undefined) => {
	const [txStatus, setTxStatus] = useState<TxStatus | undefined>(defaultValue);

	const createTxStatusTrigger = useCallback((status: TxType) => {
		return (props?: any) => {
			if (status === "Idle") return setTxStatus(undefined);

			setTxStatus({
				status,
				props,
			});
		};
	}, []);

	return {
		txStatus,
		setTxIdle: createTxStatusTrigger("Idle"),
		setTxPending: createTxStatusTrigger("Pending"),
		setTxSuccess: createTxStatusTrigger("Success"),
		setTxFailure: createTxStatusTrigger("Failure"),
	};
};
