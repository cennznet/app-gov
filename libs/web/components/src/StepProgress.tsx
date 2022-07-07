import type { FC } from "react";
import { Choose, classNames, If } from "react-extras";

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
							<div className={styles.iconWrapper}>
								<CheckCircle className="h-12 w-12 text-hero" />
								<span className={styles.line("hero")} />
							</div>
							<div className={styles.textWrapper("large")}>
								<span>{step}</span>
							</div>
						</div>
					</Choose.When>

					<Choose.When condition={index === stepIndex}>
						<div>
							<div className={styles.iconWrapper}>
								<If condition={index === steps.length - 1}>
									<CheckCircle className="h-12 w-12 text-hero" />
								</If>
								<If condition={index < steps.length - 1}>
									<Spinner className="h-10 w-10 text-hero mx-1 animate-spin" />
									<span className={styles.line("hero")} />
								</If>
							</div>
							<div className={styles.textWrapper("small")}>
								<span>{step}</span>
							</div>
						</div>
					</Choose.When>

					<Choose.When condition={index > stepIndex}>
						<div>
							<div className={styles.iconWrapper}>
								<div
									className={classNames(
										"h-10 w-10 border-4 rounded-3xl mx-1",
										index < steps.length - 1 && "border-hero"
									)}
								/>
								<If condition={index < steps.length - 1}>
									<span className={styles.line()} />
								</If>
							</div>
							<div className={styles.textWrapper("small")}>
								<span>{step}</span>
							</div>
						</div>
					</Choose.When>
				</Choose>
			</div>
		))}
	</div>
);

const styles = {
	iconWrapper: "flex items-center h-16",

	textWrapper: (variant: string) =>
		classNames(
			"flex justify-center w-10 mx-1 text-md",
			{ small: "w-10", large: "w-12" }[variant]
		),

	line: (variant?: string) =>
		classNames(
			"w-32 h-0 border-2 rounded-xl",
			{ hero: "border-hero" }[variant || ""]
		),
};
