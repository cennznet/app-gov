import { ChangeEvent, ChangeEventHandler, useState } from "react";

interface ControlledInputHook<T, E> {
	value: T;
	onChange: ChangeEventHandler<E>;
}

export const useControlledInput = <
	T,
	E extends HTMLInputElement | HTMLTextAreaElement
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
