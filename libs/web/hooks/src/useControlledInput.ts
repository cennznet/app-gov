import { ChangeEvent, ChangeEventHandler, useState } from "react";

interface ControlledInputHook<T, E> {
	value: T;
	onChange: ChangeEventHandler<E>;
}

export const useControlledInput = <
	T,
	E extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>(
	defaultValue: T
): ControlledInputHook<T, E> => {
	const [value, setValue] = useState<T>(defaultValue);

	const onChange = (event: ChangeEvent<E>) =>
		setValue(event.target.value as unknown as T);

	return {
		value,
		onChange,
	};
};

export const useControlledCheckbox = (defaultValue: boolean) => {
	const [value, setValue] = useState<boolean>(defaultValue);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.checked);

	return {
		value,
		onChange,
	};
};
