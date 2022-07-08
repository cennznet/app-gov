import { ChangeEvent, ChangeEventHandler, useCallback, useState } from "react";

interface ControlledInputHook<T, E> {
	value: T;
	onChange: ChangeEventHandler<E>;
	resetValue: (value?: T) => void;
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

	const resetValue = useCallback(
		(value = defaultValue) => {
			setValue(value);
		},
		[defaultValue]
	);

	return {
		value,
		onChange,
		resetValue,
	};
};

export const useControlledCheckbox = (
	defaultValue: boolean
): ControlledInputHook<boolean, HTMLInputElement> => {
	const [value, setValue] = useState<boolean>(defaultValue);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.checked);

	const resetValue = useCallback(
		(value = defaultValue) => {
			setValue(value);
		},
		[defaultValue]
	);

	return {
		value,
		onChange,
		resetValue,
	};
};
