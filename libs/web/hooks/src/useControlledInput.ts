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

export const useControlledCheckbox = (defaultChecked: boolean) => {
	const [checked, setChecked] = useState<boolean>(defaultChecked);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setChecked(event.target.checked);

	return {
		checked,
		onChange,
	};
};
