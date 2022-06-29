import { useCallback } from "react";

const windowObjects: Record<string, Window> = {};

export const useWindowPopup = () => {
	return useCallback((url: string, name: string, width = 640, height = 640) => {
		if (windowObjects[name] && !windowObjects[name].closed) {
			windowObjects[name].focus();
			return windowObjects[name];
		}

		const top = window.top.innerHeight / 2 + window.top.screenY - height / 2;
		const left = window.top.innerWidth / 2 + window.top.screenX - width / 2;

		const params = `popup,scrollbar=yes,width=${width},height=${height},top=${top},left=${left}`;

		return (windowObjects[name] = window.open(url, name, params));
	}, []);
};
