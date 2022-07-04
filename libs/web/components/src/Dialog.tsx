import { Dialog as BaseDialog, Transition } from "@headlessui/react";
import { FC, Fragment, MutableRefObject } from "react";
import { classNames } from "react-extras";

import { PropsWithChildren } from "@app-gov/web/types";

export interface DialogProps extends PropsWithChildren {
	className?: string;
	panelClassName?: string;
	open?: boolean;
	onClose(value: boolean): void;
	initialFocus?: MutableRefObject<HTMLElement | null> | undefined;
}

export const Dialog: FC<DialogProps> = ({
	open,
	children,
	className,
	panelClassName,
	...props
}) => {
	return (
		<Transition show={open} as={Fragment}>
			<BaseDialog {...props} className={classNames(className, "relative z-50")}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200 delay-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div
						className="pointer-events-none fixed inset-0 bg-white/60 backdrop-blur-[3px]"
						aria-hidden="true"
					/>
				</Transition.Child>
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300 delay-300"
						enterFrom="opacity-0 translate-y-2"
						enterTo="opacity-100 translate-y-0"
						leave="ease-in duration-200 delay-0"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-2"
					>
						<BaseDialog.Panel
							className={classNames(panelClassName, "w-full max-w-sm bg-white")}
						>
							{children}
						</BaseDialog.Panel>
					</Transition.Child>
				</div>
			</BaseDialog>
		</Transition>
	);
};
