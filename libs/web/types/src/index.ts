import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	FormHTMLAttributes,
	HTMLAttributes,
	InputHTMLAttributes,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";

export interface PropsWithChildren {
	children?: ReactNode;
}

export type WalletOption = "CENNZnet";

export interface IntrinsicElements {
	div: HTMLAttributes<HTMLDivElement>;
	form: FormHTMLAttributes<HTMLFormElement>;
	button: ButtonHTMLAttributes<HTMLButtonElement>;
	input: InputHTMLAttributes<HTMLInputElement>;
	a: AnchorHTMLAttributes<HTMLAnchorElement>;
	select: InputHTMLAttributes<HTMLSelectElement>;
	textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export interface CENNZEvent {
	section?: string;
	method?: string;
	data?: any[];
}

export type TxType = "Idle" | "Pending" | "Success" | "Failure";

export interface TxStatus {
	status: TxType;
	props?: any;
}
