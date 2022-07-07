import type { FC } from "react";
import { Choose, classNames, If } from "react-extras";

import { PropsWithChildren } from "@app-gov/web/types";
import { CheckCircle, Spinner } from "@app-gov/web/vectors";

interface StepProgressProps {
	steps: string[];
	stepIndex: number;
}

export const StepProgress: FC<StepProgressProps> = ({ steps, stepIndex }) => (
	<div className="m-auto flex items-center justify-center bg-white p-4">
		{steps.map((step, index) => (
			<div key={step} className="flex">
				<Choose>
					<Choose.When condition={index < stepIndex}>
						<div>
							<IconWrapper>
								<CheckCircle className="text-hero h-12 w-12" />
								<StepLine hero />
							</IconWrapper>

							<StepText variant="large">{step}</StepText>
						</div>
					</Choose.When>

					<Choose.When condition={index === stepIndex}>
						<div>
							<IconWrapper>
								<If condition={index === steps.length - 1}>
									<CheckCircle className="text-hero h-12 w-12" />
								</If>

								<If condition={index < steps.length - 1}>
									<Spinner className="text-hero mx-1 h-10 w-10 animate-spin" />
									<StepLine hero />
								</If>
							</IconWrapper>

							<StepText variant="small">{step}</StepText>
						</div>
					</Choose.When>

					<Choose.When condition={index > stepIndex}>
						<div>
							<IconWrapper>
								<div
									className={classNames(
										"mx-1 h-10 w-10 rounded-3xl border-4",
										index === stepIndex + 1 && "border-hero"
									)}
								/>

								<If condition={index < steps.length - 1}>
									<StepLine />
								</If>
							</IconWrapper>

							<StepText variant="small">{step}</StepText>
						</div>
					</Choose.When>
				</Choose>
			</div>
		))}
	</div>
);

interface StepTextProps extends PropsWithChildren {
	variant: string;
}

const StepText: FC<StepTextProps> = ({ children, variant }) => (
	<div
		className={classNames(
			"text-md mx-1 flex w-10 justify-center",
			{ small: "w-10", large: "w-12" }[variant]
		)}
	>
		{children}
	</div>
);

const IconWrapper: FC<PropsWithChildren> = ({ children }) => (
	<div className="flex h-16 items-center">{children}</div>
);

const StepLine: FC<{ hero?: boolean }> = ({ hero }) => (
	<span
		className={classNames(
			"h-0 w-32 rounded-xl border-2",
			hero && "border-hero"
		)}
	/>
);
