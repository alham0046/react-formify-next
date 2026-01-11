import * as React from 'react';
import React__default, { ReactNode, ReactElement, RefObject } from 'react';

interface FullInputProps$1 {
    placeholder: string;
    containerStyles?: string;
    maxLength?: number;
    inputStyles?: string;
    placeholderStyles?: string;
    initialValue?: string;
    autoFocus?: boolean;
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

declare const MemoizedStrInput: React.NamedExoticComponent<InputProps & React.RefAttributes<InputRefProps>>;

interface NumInputProps extends InputProps {
    stringify?: boolean;
}
declare const MemoizedNumInput: React__default.NamedExoticComponent<NumInputProps & React__default.RefAttributes<InputRefProps>>;

interface ArrayHelpers {
    add: (item: any) => void;
    remove: (index: number) => void;
    isLast: (index: number) => boolean;
}
interface ArrayContainerProps {
    name: string;
    items: any[];
    defaultAddItem?: any;
    getKey?: (item: any, index: number) => string;
    children: (item: any, index: number, helpers: ArrayHelpers) => ReactNode;
}
declare const _default$1: React.NamedExoticComponent<ArrayContainerProps>;

interface ObjContainerProps {
    name: string;
    children: ReactNode;
}
declare const MemoizedObjectContainer: React.NamedExoticComponent<ObjContainerProps>;

interface StyleProp {
    inputStyles?: string;
    placeholderStyles?: string;
    containerStyles?: string;
    modalBoxStyles?: string;
    optionBoxStyles?: string;
    optionStyles?: string;
    dropdownOffset?: number;
}

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
    options: SelectOption[] | string[];
    initialValue?: string;
    initialLabel?: string;
    disabled?: boolean | string;
    hideElement?: boolean | string;
    styles?: StyleProp;
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
    onInputChange: (name: string, value: string) => void;
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
}
type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;
declare const MemoizedSelectInput: React.NamedExoticComponent<SelectProps>;

interface FullAutoInputProps {
    initialData?: object;
    exclusionKeys?: string | string[];
    onInputChange?: () => void;
    sharedStyles?: object;
    name?: undefined;
    bgColor?: string;
}
type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">;
declare const MemoizedAutoInput: React__default.NamedExoticComponent<AutoInputProps>;

interface DateProps extends InputProps {
    onDateSelect?: (date: string) => void;
    defaultTodayDate?: boolean;
    defaultDate?: string;
}
declare const memoizedDateInput: React__default.NamedExoticComponent<DateProps>;

interface FullDisabledProps {
    initialValue?: string;
    containerStyles?: string;
    inputStyles?: string;
    placeholderStyles?: string;
    placeholder: string;
    onChange?: (value: string | number, data: string | null) => void;
    name?: string;
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string) => void;
}
type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;
declare const MemoizedDisabledInput: React.NamedExoticComponent<DisabledInputProps>;

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
declare const MemoizedSubmitButton: React__default.NamedExoticComponent<SubmitProps & React__default.RefAttributes<SubmitButtonRef>>;

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
declare const _default: React__default.NamedExoticComponent<InputContainerProps>;

declare function useInputStore(key: string): any;

interface FieldProps {
    [key: string]: any;
}
declare const setFieldValue: (FieldCredentials: FieldProps) => void;

declare const setEditData: (data: Record<string, any>) => void;

export { _default$1 as ArrayContainer, MemoizedAutoInput as AutoInput, type ConfirmationRenderProps, memoizedDateInput as DateInput, MemoizedDisabledInput as DisabledInput, _default as InputContainer, MemoizedNumInput as NumInput, MemoizedObjectContainer as ObjectContainer, MemoizedSelectInput as SelectInput, MemoizedStrInput as StrInput, MemoizedSubmitButton as SubmitButton, type SubmitButtonRef, type SubmitHandler, setEditData, setFieldValue, useInputStore };
