import type { FC } from "react";
import { Choose, classNames, If } from "react-extras";

import { PropsWithChildren } from "@app-gov/web/types";
import { CheckCircleFilled, Spinner } from "@app-gov/web/vectors";

interface StepProgressProps extends PropsWithChildren {
	steps: string[];
	stepIndex: number;
}

export const StepProgress: FC<StepProgressProps> = ({
	steps,
	stepIndex,
	children,
}) => (
	<div className="space-y-4">
		<div className="m-auto flex items-center justify-center p-4">
			{steps.map((step, index) => (
				<div key={step} className="flex">
					<Choose>
						<Choose.When condition={index < stepIndex}>
							<div>
								<IconWrapper>
									<CheckCircleFilled className="text-hero h-10 w-10 sm:h-12 sm:w-12" />
									<StepLine active />
								</IconWrapper>

								<StepText>{step}</StepText>
							</div>
						</Choose.When>

						<Choose.When condition={index === stepIndex}>
							<div>
								<IconWrapper>
									<If condition={index === steps.length - 1}>
										<CheckCircleFilled className="text-hero h-10 w-10 sm:h-12 sm:w-12" />
									</If>

									<If condition={index < steps.length - 1}>
										<Spinner className="text-hero mx-1 h-8 w-8 animate-spin sm:h-10 sm:w-10" />
										<StepLine active />
									</If>
								</IconWrapper>

								<StepText>{step}</StepText>
							</div>
						</Choose.When>

						<Choose.When condition={index > stepIndex}>
							<div>
								<IconWrapper>
									<div
										className={classNames(
											"mx-1 h-8 w-8 rounded-3xl border-4 sm:h-10 sm:w-10",
											index === stepIndex + 1 ? "border-hero" : "border-hero/40"
										)}
									/>

									<If condition={index < steps.length - 1}>
										<StepLine />
									</If>
								</IconWrapper>

								<StepText waiting={index > stepIndex + 1}>{step}</StepText>
							</div>
						</Choose.When>
					</Choose>
				</div>
			))}
		</div>
		<div>{children}</div>
	</div>
);

interface StepTextProps extends PropsWithChildren {
	waiting?: boolean;
}

const StepText: FC<StepTextProps> = ({ waiting, children }) => (
	<div
		className={classNames(
			"mx-1 flex w-10 justify-center text-xs md:text-sm",
			waiting && "text-gray-500"
		)}
	>
		{children}
	</div>
);

const StepLine: FC<{ active?: boolean }> = ({ active }) => (
	<span
		className={classNames(
			"h-0 w-16 rounded-xl border-2 md:w-24 lg:w-32",
			active ? "border-hero" : "border-hero/40"
		)}
	/>
);

const IconWrapper: FC<PropsWithChildren> = ({ children }) => (
	<div className="flex h-14 items-center sm:h-16">{children}</div>
);
