import { InputStyle, TWInputStyleProp } from "./stylesProps";

export interface FullInputProps {
    placeholder: string;
    // containerStyles?: string;
    maxLength?: number
    children?: React.ReactNode
    // inputStyles?: string;
    // placeholderStyles?: string;
    initialValue?: string;
    autoFocus?: boolean
    twStyle?: Partial<TWInputStyleProp>
    style?: Partial<InputStyle>
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



type Year = `${number}${number}${number}${number}`
type Month = `0${1|2|3|4|5|6|7|8|9}` | `1${0|1|2}`
type Day =
  | `0${1|2|3|4|5|6|7|8|9}`
  | `${1|2}${number}`
  | `3${0|1}`

export type DateString = `${Year}-${Month}-${Day}`