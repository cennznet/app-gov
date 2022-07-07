import type { FC } from "react";
import { Choose, classNames, If } from "react-extras";

import { PropsWithChildren } from "@app-gov/web/types";
import { CheckCircle, Spinner } from "@app-gov/web/vectors";

interface StepProgressProps {
	steps: string[];
	stepIndex: number;
}

export const StepProgress: FC<StepProgressProps> = ({ steps, stepIndex }) => (
	<div className="flex items-center bg-white m-auto justify-center p-4">
		{steps.map((step, index) => (
			<div key={step} className="flex">
				<Choose>
					<Choose.When condition={index < stepIndex}>
						<div>
							<IconWrapper>
								<CheckCircle className="h-12 w-12 text-hero" />
								<StepLine hero />
							</IconWrapper>

							<StepText variant="large">{step}</StepText>
						</div>
					</Choose.When>

					<Choose.When condition={index === stepIndex}>
						<div>
							<IconWrapper>
								<If condition={index === steps.length - 1}>
									<CheckCircle className="h-12 w-12 text-hero" />
								</If>

								<If condition={index < steps.length - 1}>
									<Spinner className="h-10 w-10 text-hero mx-1 animate-spin" />
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
										"h-10 w-10 border-4 rounded-3xl mx-1",
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
			"flex justify-center w-10 mx-1 text-md",
			{ small: "w-10", large: "w-12" }[variant]
		)}
	>
		{children}
	</div>
);

const IconWrapper: FC<PropsWithChildren> = ({ children }) => (
	<div className="flex items-center h-16">{children}</div>
);

const StepLine: FC<{ hero?: boolean }> = ({ hero }) => (
	<span
		className={classNames(
			"w-32 h-0 border-2 rounded-xl",
			hero && "border-hero"
		)}
	/>
);
