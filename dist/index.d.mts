import * as react from 'react';
import react__default, { ReactNode, ReactElement, RefObject } from 'react';

interface DropdownStyleProp {
    dropdownOffset: number;
    selectedStyles?: React.CSSProperties;
    highlightedStyles?: React.CSSProperties;
    inputStyles?: string;
    placeholderStyles?: string;
    containerStyles?: string;
    modalBoxStyles?: string;
    optionBoxStyles?: string;
    optionStyles?: string;
}
interface InputStyle {
    borderWidth: number | string;
    boxHeight: number | string;
    boxWidth: number | string;
    placeHolderOffset: number | string;
    inputInlineStyle?: Omit<React.CSSProperties, 'border' | 'borderWidth'>;
    placeholderInlineStyle?: React.CSSProperties;
}

interface FullInputProps$1 {
    placeholder: string;
    containerStyles?: string;
    maxLength?: number;
    children?: React.ReactNode;
    inputStyles?: string;
    placeholderStyles?: string;
    initialValue?: string;
    autoFocus?: boolean;
    style?: Partial<InputStyle>;
    privacy?: boolean;
    disabled?: string | boolean;
    hideElement?: string | boolean;
    onEnterPress?: (args: {
        currentValue?: string | number;
        allData?: Record<string, any>;
    }) => void;
    onBlur?: (args: {
        currentValue?: string | number;
        allData?: Record<string, any>;
    }) => void;
    name?: string;
    onChange?: (value: string | number) => void;
    onDisableChange?: (args: {
        state: boolean;
        disabledKey?: string;
        disabledValue: any;
        storeValue: Record<string, any> | null;
        setValue: (value: any) => void;
    }) => void;
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string | number) => void;
}
type InputProps = Omit<FullInputProps$1, "isArrayObject" | "arrayData" | "onInputChange">;
interface InputRefProps {
    focus: () => void;
    blur: () => void;
    reset: () => void;
}
type Year = `${number}${number}${number}${number}`;
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`;
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`;
type DateString = `${Year}-${Month}-${Day}`;

declare const MemoizedStrInput: react.NamedExoticComponent<InputProps & react.RefAttributes<InputRefProps>>;

interface NumInputProps extends InputProps {
    stringify?: boolean;
}
declare const MemoizedNumInput: react__default.NamedExoticComponent<NumInputProps & react__default.RefAttributes<InputRefProps>>;

interface ArrayHelpers {
    add: (item: any) => void;
    remove: (index: number) => void;
    isLast: (index: number) => boolean;
    arrayLength: number;
}
interface ArrayContainerProps {
    name: string;
    items: any[];
    defaultAddItem?: any;
    getKey?: (item: any, index: number) => string;
    children: (item: any, index: number, helpers: ArrayHelpers) => ReactNode;
}
declare const _default$3: react.NamedExoticComponent<ArrayContainerProps>;

interface ObjContainerProps {
    name: string;
    children: ReactNode;
}
declare const MemoizedObjectContainer: react.NamedExoticComponent<ObjContainerProps>;

interface OptionMap {
    [key: string]: string[];
}

interface SelectOption {
    label: string;
    value: string;
}
interface FullInputProps {
    name?: string;
    placeholder: string;
    /** NEW — generic dependent dropdown system */
    dependsOn?: string;
    optionsMap?: OptionMap;
    children?: React.ReactNode;
    options: SelectOption[] | string[];
    initialValue?: string;
    initialLabel?: string;
    disabled?: boolean | string;
    hideElement?: boolean | string;
    style?: Partial<InputStyle> & Partial<Pick<DropdownStyleProp, 'dropdownOffset'>>;
    twStyle?: Omit<DropdownStyleProp, 'dropdownOffset'>;
    searchable?: boolean;
    onDisableChange?: (args: {
        state: boolean;
        disabledKey?: string;
        disabledValue: any;
        storeValue: Record<string, any> | null;
        setValue: (value: any) => void;
    }) => void;
    onChange?: (value: string) => void;
    onToggleDropdown?: (isOpen: boolean) => void;
}
type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;
declare const MemoizedSelectInput: react.NamedExoticComponent<SelectProps>;

interface FullAutoInputProps {
    initialData?: object;
    exclusionKeys?: string | string[];
    onInputChange?: () => void;
    sharedStyles?: object;
    name?: undefined;
    bgColor?: string;
}
type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">;
declare const MemoizedAutoInput: react__default.NamedExoticComponent<AutoInputProps>;

interface DateProps extends InputProps {
    onDateSelect?: (date: string) => void;
    defaultTodayDate?: boolean;
    defaultDate?: DateString;
}
declare const memoizedDateInput: react__default.NamedExoticComponent<DateProps>;

interface FullDisabledProps {
    initialValue?: string;
    containerStyles?: string;
    children?: React.ReactNode;
    inputStyles?: string;
    placeholderStyles?: string;
    placeholder: string;
    style?: Partial<InputStyle>;
    privacy?: boolean;
    hideElement?: string | boolean;
    onChange?: (value: string | number) => void;
    name?: string;
}
type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;
declare const MemoizedDisabledInput: react.NamedExoticComponent<DisabledInputProps>;

interface FormRowProps {
    label: React.ReactNode;
    separator?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    labelWidth?: string | number;
}
declare const _default$2: react.NamedExoticComponent<FormRowProps>;

type SearchOnChange<T> = (value: string | number) => T[] | Promise<T[]>;
interface SearchInputProps<T> extends Exclude<InputProps, "onChange"> {
    onChange: SearchOnChange<T>;
    renderItem?: (item: T, index: number, active: boolean) => React.ReactNode;
    onSelect?: (args: {
        value: any;
        setValue: (value: any) => void;
    }) => void;
}
declare const _default$1: react.NamedExoticComponent<SearchInputProps<any> & react.RefAttributes<InputRefProps>>;

type SubmitData = {
    data: Record<string, any> | null;
    edited: Record<string, any> | null;
    resetForm: (key?: string[] | string) => void;
};
type SubmitHandler = (args: SubmitData) => Promise<boolean | void>;
interface ConfirmationRenderProps {
    success: (data?: any) => void;
    cancel: () => void;
    data: Record<string, any> | null;
    isDisabled?: boolean;
    resetForm: (key?: string[] | string) => void;
}
interface SubmitButtonRef {
    submit: () => void;
}
interface SubmitProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    closeModal?: () => void;
    onClick?: SubmitHandler;
    /**
     * Configuration for enabling and customizing a confirmation modal.
     * If provided, the final action (onConfirm) is only executed after the user confirms inside the modal.
     * * @example
     * // Assuming ConfirmComponent is a function that takes ConfirmationRenderProps
     * modal: {
     * modalStyle: { width: '50%' }  // width and height can be in % or px or simple number
     * renderConfirmationModel: (props) => <ConfirmComponent {...props} />,  // prefered to be used as function
     * isDisabled : false    // if you want to disable the cornfirmation modal submit button conditionally
     * onConfirm: handleSubmitFunction,
     * }
     */
    modal?: {
        modalStyle?: {
            height?: string | number;
            width?: string | number;
        };
        renderConfirmationModel?: ((props: ConfirmationRenderProps) => ReactNode) | ReactElement<ConfirmationRenderProps>;
        isDisabled?: boolean;
        onConfirm?: (data: any) => void;
    };
}
declare const MemoizedSubmitButton: react__default.NamedExoticComponent<SubmitProps & react__default.RefAttributes<SubmitButtonRef>>;

interface InputContainerProps {
    children: ReactNode;
    inputContainerStyles?: string;
    mode?: "default" | "edit";
    sharedStyles?: {
        placeholderStyles?: string;
        inputStyles?: string;
        [key: string]: any;
    };
    modalContainerRef?: RefObject<HTMLDivElement>;
}
declare const _default: react__default.NamedExoticComponent<InputContainerProps>;

interface FieldProps {
    [key: string]: any;
}
declare const setFieldValue: (FieldCredentials: FieldProps) => void;

declare const setEditData: (data: Record<string, any>) => void;

declare const ResetForm: (resetData?: Record<string, any>) => (key?: string | string[]) => void;
declare const ClearForm: () => void;

declare const SharedContext: {
    get: (key?: string) => any;
    set: (key: string, value: any) => Map<string, any>;
    addMany: (data: Record<string, any>) => void;
    remove: (key: string) => boolean;
    clear: () => void;
};

export { _default$3 as ArrayContainer, MemoizedAutoInput as AutoInput, ClearForm, type ConfirmationRenderProps, memoizedDateInput as DateInput, MemoizedDisabledInput as DisabledInput, _default$2 as FormRow, _default as InputContainer, MemoizedNumInput as NumInput, MemoizedObjectContainer as ObjectContainer, ResetForm, _default$1 as SearchInput, MemoizedSelectInput as SelectInput, SharedContext, MemoizedStrInput as StrInput, MemoizedSubmitButton as SubmitButton, type SubmitButtonRef, type SubmitHandler, setEditData, setFieldValue };
