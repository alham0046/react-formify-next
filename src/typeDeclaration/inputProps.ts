export interface FullInputProps {
    placeholder: string;
    containerStyles?: string;
    maxLength?: number
    inputStyles?: string;
    placeholderStyles?: string;
    initialValue?: string;
    autoFocus?: boolean
    privacy?: boolean
    disabled?: string | boolean
    hideElement?: string | boolean
    onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    name?: string;
    onChange?: (value: string | number) => void
    onDisableChange?: (args: {
        state: boolean,
        disabledKey?: string,
        disabledValue: any,
        storeValue: Record<string, any> | null,
        setValue: (value: any) => void
    }) => void
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string | number) => void;
}

export type InputProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;



export interface InputRefProps {
    focus: () => void
    blur: () => void
    reset: () => void
}