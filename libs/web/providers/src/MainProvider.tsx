import { cloneElement, FC, ReactElement, ReactNode } from "react";

import { PropsWithChildren } from "@app-gov/web/types";

export interface MainProviderProps extends PropsWithChildren {
	providers: ReactElement[];
}

export const MainProvider: FC<MainProviderProps> = ({
	providers,
	children,
}) => {
	const renderProvider = (
		providers: ReactElement[],
		children: ReactNode
	): any => {
		const [provider, ...restProviders] = providers;

		if (provider) {
			return cloneElement(
				provider,
				undefined,
				renderProvider(restProviders, children)
			);
		}

		return children;
	};

	return renderProvider(providers, children);
};
