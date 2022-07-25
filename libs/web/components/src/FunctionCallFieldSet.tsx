import {
	ChangeEventHandler,
	ComponentProps,
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import {
	extractCallableExtrinsics,
	ExtrinsicArg,
} from "@app-gov/service/cennznet";
import { IntrinsicElements, PropsWithChildren } from "@app-gov/web/utils";

import { Select, TextField } from "./";

type SelectProps = ComponentProps<typeof Select>;

type CallableExtrinsics = Awaited<ReturnType<typeof extractCallableExtrinsics>>;

interface ContextType {
	sectionList?: string[];
	methodList?: string[];
	argList?: ExtrinsicArg[];
	selectedSection?: string;
	selectedMethod?: string;
	setSelectedSection?: Dispatch<SetStateAction<string>>;
	setSelectedMethod?: Dispatch<SetStateAction<string>>;
}

interface ProviderProps extends PropsWithChildren {
	extrinsics: CallableExtrinsics;
	defaultSection?: string;
	defaultMethod?: string;
}

const Context = createContext({} as ContextType);

const Provider: FC<ProviderProps> = ({
	children,
	extrinsics,
	defaultSection = "baseFee",
	defaultMethod = "setBaseFeePerGas",
}) => {
	const [selectedSection, setSelectedSection] =
		useState<string>(defaultSection);
	const [selectedMethod, setSelectedMethod] = useState<string>(defaultMethod);
	const sectionList = useMemo(() => Object.keys(extrinsics), [extrinsics]);
	const methodList = useMemo(
		() => Object.keys(extrinsics?.[selectedSection] ?? {}),
		[extrinsics, selectedSection]
	);
	const firstRender = useRef<boolean>(true);
	const argList = useMemo(
		() => extrinsics?.[selectedSection]?.[selectedMethod],
		[extrinsics, selectedMethod, selectedSection]
	);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		setSelectedMethod(methodList?.[0]);
	}, [methodList]);

	return (
		<Context.Provider
			value={{
				sectionList,
				methodList,
				argList,
				selectedSection,
				selectedMethod,
				setSelectedSection,
				setSelectedMethod,
			}}
		>
			{children}
		</Context.Provider>
	);
};

const Section: FC<Omit<SelectProps, "children">> = (props) => {
	const { selectedSection, setSelectedSection, sectionList } =
		useContext(Context);
	const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
		(event) => {
			if (!setSelectedSection) return;
			setSelectedSection(event.target.value);
		},
		[setSelectedSection]
	);

	return (
		<Select {...props} onChange={onChange} value={selectedSection}>
			{sectionList?.map((section, index) => (
				<option value={section} key={index}>
					{section}
				</option>
			))}
		</Select>
	);
};

const Method: FC<Omit<SelectProps, "children">> = (props) => {
	const { selectedMethod, setSelectedMethod, methodList } = useContext(Context);

	const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
		(event) => {
			if (!setSelectedMethod) return;
			setSelectedMethod(event.target.value);
		},
		[setSelectedMethod]
	);

	return (
		<Select {...props} onChange={onChange} value={selectedMethod}>
			{methodList?.map((method, index) => (
				<option value={method} key={index}>
					{method}
				</option>
			))}
		</Select>
	);
};

interface ArgsProps {
	name?: string;
}

const Args: FC<Omit<IntrinsicElements["ul"], "children"> & ArgsProps> = ({
	name,
	...props
}) => {
	const { argList, selectedSection, selectedMethod } = useContext(Context);

	return (
		<ul {...props}>
			{argList?.map((arg, index) => (
				<li
					className="mb-1 text-xs"
					key={`${selectedSection}.${selectedMethod}-${index}`}
				>
					<TextField
						placeholder={`\`${arg.type}\``}
						className="font-mono"
						required
						name={name}
						startAdornment={
							<span className="block w-36 border-r border-slate-200 font-mono">
								{arg.name}
							</span>
						}
					/>
				</li>
			))}
		</ul>
	);
};

export const FunctionCallFieldSet = {
	Provider,
	Section,
	Method,
	Args,
};
