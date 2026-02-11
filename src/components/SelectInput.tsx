import { type FC, memo, useCallback, useEffect } from 'react';
import SelectTemplate from './SelectTemplate';
import { useComputedExpression } from '../hooks/useComputedExpression';
import { setFieldValue } from '../Utils/SetFieldValue';
import { useFieldName } from '../hooks/useFieldName';
import { useSelectOptions, type OptionMap } from '../hooks/useSelectOptions';
import { inputStore } from 'src/store/InputStore';
import { handleInitialValue } from 'src/Utils/setInitialValue';
import InputTemplate from './InputTemplate';
import DropdownModal from './DropdownModal';
import { DropdownStyleProp, InputStyle } from 'src/typeDeclaration/stylesProps';
import { useContainerContext } from 'src/context/ContainerContext';
import { DEFAULT_DROPDOWN_STYLE } from 'src/styles/DropdownStyles';

interface SelectOption {
    label: string;
    value: string;
}

interface FullInputProps {
    name?: string
    placeholder: string
    /** NEW — generic dependent dropdown system */
    dependsOn?: string;
    optionsMap?: OptionMap;
    children?: React.ReactNode
    options: SelectOption[] | string[]
    initialValue?: string;
    initialLabel?: string
    disabled?: boolean | string
    hideElement?: boolean | string
    style?: Partial<InputStyle> & Partial<Pick<DropdownStyleProp, 'dropdownOffset'>>
    twStyle?: Omit<DropdownStyleProp, 'dropdownOffset'>
    // styles?: StyleProp
    searchable?: boolean
    onDisableChange?: (args: {
        state: boolean,
        disabledKey?: string,
        disabledValue: any,
        storeValue: Record<string, any> | null,
        setValue: (value: any) => void
    }) => void
    onChange?: (value: string) => void
    onToggleDropdown?: (isOpen: boolean) => void
}

type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

const SelectInput: FC<SelectProps> = ({
    name,
    placeholder,
    options,
    children,
    onChange,
    dependsOn,
    onToggleDropdown,
    optionsMap,
    initialLabel,
    twStyle ={},
    disabled = false,
    hideElement = false,
    searchable = false,
    onDisableChange,
    initialValue = '',
    style,
}) => {
    const modifiedName = useFieldName(placeholder, name)

    const {sharedStyles, modalContainerRef} = useContainerContext()

    const handleOnDisableChange = useCallback((value: any) => {
        setFieldValue({ [modifiedName]: value })
    }, [modifiedName])

    const disabledValue: boolean = useComputedExpression(disabled)

    const hiddenValue: boolean = useComputedExpression(hideElement)

    const resolvedStyle: InputStyle & Pick<DropdownStyleProp, 'dropdownOffset'> = {
            ...DEFAULT_DROPDOWN_STYLE,
            ...sharedStyles,
            ...style, // 👈 highest priority
        }

    // const {inputInlineStyle} = resolvedStyle

    useEffect(() => {
        if (onDisableChange) {
            // const { inputData } = inputStore.getSnapshot()
            const currentDisabled = inputStore.getInputNestedValue(modifiedName)
            onDisableChange({
                state: disabledValue,
                disabledKey: modifiedName,
                disabledValue: currentDisabled,
                storeValue: inputStore.getSnapshot().inputData,
                setValue: handleOnDisableChange
            })
        }
    }, [disabledValue])

    const staticOptions = useSelectOptions({
        options,
        dependsOn,
        optionsMap,
        initialLabel,
        initialValue
    })

    const handleSelect = (selectedValue: string) => {
        onChange?.(selectedValue);
        inputStore.setValue(modifiedName, selectedValue);
    };

    if (hiddenValue) {
        return null;
    }

    return (
        <div className={`relative ${twStyle?.containerStyles}`} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            <InputTemplate
                name={modifiedName}
                placeholder={placeholder}
                style={style}
                placeholderStyles={twStyle?.placeholderStyles}
                childType={'dropdown'}
            >
                <DropdownModal
                    onSelect={handleSelect}
                    options={staticOptions}
                    name={modifiedName}
                    style={resolvedStyle}
                    twStyle={twStyle}
                    onToggleDropdown={onToggleDropdown}
                    searchable={searchable}
                    disabled={disabledValue}
                    modalContainerRef={modalContainerRef}
                    
                />
            </InputTemplate>
            {children}
        </div>
    );
};

// export default memo(SelectInput, (prev, next) => prev.name === next.name);
const MemoizedSelectInput = memo(SelectInput, (prev, next) => prev.placeholder === next.placeholder)
MemoizedSelectInput.displayName = 'SelectInput';
export default MemoizedSelectInput;








// import { type FC, memo, useCallback, useEffect } from 'react';
// import SelectTemplate from './SelectTemplate';
// import { useComputedExpression } from '../hooks/useComputedExpression';
// import { type StyleProp } from '../typeDeclaration/stylesProps';
// import { setFieldValue } from '../Utils/SetFieldValue';
// import { useFieldName } from '../hooks/useFieldName';
// import { useSelectOptions, type OptionMap } from '../hooks/useSelectOptions';
// import { inputStore } from 'src/store/InputStore';
// import { handleInitialValue } from 'src/Utils/setInitialValue';

// interface SelectOption {
//     label: string;
//     value: string;
// }

// interface FullInputProps {
//     name?: string
//     placeholder: string
//     /** NEW — generic dependent dropdown system */
//     dependsOn?: string;
//     optionsMap?: OptionMap;
//     options: SelectOption[] | string[]
//     initialValue?: string;
//     initialLabel?: string
//     disabled?: boolean | string
//     hideElement?: boolean | string
//     styles?: StyleProp
//     searchable?: boolean
//     onDisableChange?: (args: {
//         state: boolean,
//         disabledKey?: string,
//         disabledValue: any,
//         storeValue: Record<string, any> | null,
//         setValue: (value: any) => void
//     }) => void
//     onChange?: (value: string) => void
//     onToggleDropdown?: (isOpen: boolean) => void
//     onInputChange: (name: string, value: string) => void
//     isArrayObject?: boolean
//     arrayData?: {
//         arrayName: string
//         arrayIndex: number
//     }
//     //   sharedStyles?: {
//     //     placeholderStyles?: string;
//     //   };
//     //   bgColor: string;
// }

// type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

// const SelectInput: FC<SelectProps> = ({
//     name,
//     placeholder,
//     options,
//     onChange,
//     dependsOn,
//     onToggleDropdown,
//     optionsMap,
//     initialLabel,
//     disabled = false,
//     hideElement = false,
//     searchable = false,
//     onDisableChange,
//     initialValue = '',
//     styles = {
//         inputStyles: '',
//         placeholderStyles: '',
//         containerStyles: '',
//         modalBoxStyles: '',
//         optionBoxStyles: '',
//         optionStyles: '',
//         dropdownOffset: 5
//     },
//     ...props
// }) => {
//     const modifiedName = useFieldName(placeholder, name)

//     const handleOnDisableChange = useCallback((value: any) => {
//         setFieldValue({ [modifiedName]: value })
//     }, [modifiedName])

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue)
//     }, [])

//     const disabledValue: boolean = useComputedExpression(disabled)

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     useEffect(() => {
//         if (onDisableChange) {
//             // const { inputData } = inputStore.getSnapshot()
//             const currentDisabled = inputStore.getInputNestedValue(modifiedName)
//             onDisableChange({
//                 state: disabledValue,
//                 disabledKey: modifiedName,
//                 disabledValue: currentDisabled,
//                 storeValue: inputStore.getSnapshot().inputData,
//                 setValue: handleOnDisableChange
//             })
//         }
//     }, [disabledValue])

//     const staticOptions = useSelectOptions({
//         options,
//         dependsOn,
//         optionsMap,
//         initialLabel,
//         initialValue
//     })

//     const handleSelect = (selectedValue: string) => {
//         onChange?.(selectedValue);
//         inputStore.setValue(modifiedName, selectedValue);
//     };

//     return (
//         <div style={{ display: hiddenValue ? 'none' : 'block' }}>
//             <SelectTemplate
//                 name={modifiedName}
//                 placeholder={placeholder}
//                 onToggleDropdown={onToggleDropdown}
//                 options={staticOptions}
//                 disabled={disabledValue}
//                 hideElement={hiddenValue}
//                 seachable={searchable}
//                 onSelect={handleSelect}
//                 styles={styles}
//                 {...props}
//             />
//         </div>
//     );
// };

// // export default memo(SelectInput, (prev, next) => prev.name === next.name);
// const MemoizedSelectInput = memo(SelectInput, (prev, next) => prev.placeholder === next.placeholder)
// MemoizedSelectInput.displayName = 'SelectInput';
// export default MemoizedSelectInput;










// import React, { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';
// import { useInputStore } from 'src/hooks/useInputStore';
// import { getNestedValue } from 'src/Utils/inputStoreUtils';
// import SelectTemplate from './SelectTemplate';
// import { useComputedExpression } from 'src/hooks/useComputedExpression';
// import { useFormInitials } from 'src/hooks/useFormInitialState';

// interface SelectOption {
//     label: string;
//     value: string;
// }

// interface FullInputProps {
//     name?: string
//     placeholder: string
//     options: SelectOption[] | string[]
//     initialValue?: string;
//     initialLabel?: string
//     disabled?: boolean | string
//     hideElement?: boolean | string
//     onDisableChange?: (args: {
//         state: boolean,
//         disabledKey?: string,
//         disabledValue: any,
//         storeValue: Record<string, any>,
//         setValue: (value: any) => void
//     }) => void
//     onChange?: (value: string) => void
//     onInputChange: (name: string, value: string) => void
//     inputStyles?: string
//     placeholderStyles?: string
//     containerStyles?: string
//     isArrayObject?: boolean
//     arrayData?: {
//         arrayName: string
//         arrayIndex: number
//     }
//     //   sharedStyles?: {
//     //     placeholderStyles?: string;
//     //   };
//     //   bgColor: string;
// }

// type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

// const SelectInput: FC<SelectProps> = ({
//     name,
//     placeholder,
//     options,
//     onChange = () => { },
//     disabled = false,
//     hideElement = false,
//     onDisableChange,
//     initialLabel,
//     initialValue = '',
//     inputStyles = '',
//     placeholderStyles = '',
//     containerStyles = '',
//     //   sharedStyles = {},
//     //   bgColor = 'white',
//     ...props
// }) => {
//     const fullProps = props as FullInputProps
//     const value: string = useInputStore((state) => {
//         if (fullProps.isArrayObject) {
//             const arr = fullProps.arrayData!;
//             return state.inputData[arr.arrayName]?.[arr.arrayIndex]?.[name!] ?? '';
//         }
//         return getNestedValue(state.inputData, name!) ?? '';
//     });

//     const handleOnDisableChange = useCallback((value: any) => {
//         useFormInitials({ [name!]: value })
//     }, [name])

//     const disabledValue: boolean = useComputedExpression(disabled, name!)

//     const hiddenValue: boolean = useComputedExpression(hideElement, name!)

//     useEffect(() => {
//         if (onDisableChange) {
//             const { inputData } = useInputStore.getState()
//             const currentDisabled = getNestedValue(inputData, name)
//             onDisableChange({
//                 state: disabledValue,
//                 disabledKey: name,
//                 disabledValue: currentDisabled,
//                 storeValue: inputData,
//                 setValue: handleOnDisableChange
//             })
//         }
//     }, [disabledValue])

//     const prevValueRef = useRef(value);

//     useEffect(() => {
//         if (value !== prevValueRef.current) {
//             prevValueRef.current = value;
//             if (value !== '') onChange(value);
//         }
//     }, [value]);

//     const refinedOption: SelectOption[] = useMemo(() => {
//         if (options.length > 0 && typeof options[0] !== 'string') {
//             return options as SelectOption[]
//         }
//         const initialItem = initialLabel ? [{ label: initialLabel, value: initialValue }] : []
//         const newOption = (options as string[]).map((item) => ({ label: item, value: item }))
//         return [...initialItem, ...newOption]
//     }, [options])

//     const handleSelect = (selectedValue: string) => {
//         onChange(selectedValue);
//         if (fullProps.onInputChange) {
//             fullProps.onInputChange(name!, selectedValue);
//         }
//         // useInputStore.getState().setInputValue(name, selectedValue);
//     };

//     return (
//         <div style={{ display: hiddenValue ? 'none' : 'block' }}>
//             <SelectTemplate
//                 name={name!}
//                 value={value}
//                 placeholder={placeholder}
//                 options={refinedOption}
//                 disabled={disabledValue}
//                 hideElement={hiddenValue}
//                 onSelect={handleSelect}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 containerStyles={containerStyles}
//                 {...props}
//             />
//         </div>
//     );
// };

// const MemoizedSelectInput = memo(SelectInput)
// MemoizedSelectInput.displayName = 'SelectInput';
// export default MemoizedSelectInput;
