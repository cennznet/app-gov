import { PropsWithChildren } from "@gov-app/libs/types";
import { cloneElement, FC, ReactElement, ReactNode } from "react";

export interface MainProviderProps extends PropsWithChildren {
	providers: ReactElement[];
}

export const MainProvider: FC<MainProviderProps> = ({
	providers,
	children,
}) => {
	const renderProvider = (providers: ReactElement[], children: ReactNode) => {
		const [provider, ...restProviders] = providers;

		if (provider) {
			return cloneElement(
				provider,
				null,
				renderProvider(restProviders, children)
			);
		}

		return children;
	};

	return renderProvider(providers, children);
};
