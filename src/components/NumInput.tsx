import React, { forwardRef, memo, useCallback, useEffect, useRef } from 'react'
import type { InputProps, InputRefProps } from "../typeDeclaration/inputProps";
import { useInputStore } from "../hooks/useInputStore";
import { useComputedExpression } from "../hooks/useComputedExpression";
import InputTemplate from "./InputTemplate";
import { handleInitialValue } from '../Utils/setInitialValue';
import { setFieldValue } from '../Utils/SetFieldValue';
import { isIndex } from '../Utils/Helper';
import { useFieldName } from '../hooks/useFieldName';
import { inputStore } from 'src/store/InputStore';

interface NumInputProps extends InputProps {
    stringify?: boolean
}

const NumInput = forwardRef<InputRefProps, NumInputProps>(({
    placeholder,
    onEnterPress,
    onBlur,
    containerStyles,
    stringify = false,
    autoFocus = false,
    privacy = false,
    disabled = false,
    hideElement = false,
    onDisableChange,
    maxLength,
    inputStyles,
    placeholderStyles,
    onChange,
    initialValue = "",
    name,
    ...props
}, ref) => {
    const modifiedName = useFieldName(placeholder, name)

    useEffect(() => {
        handleInitialValue(modifiedName, initialValue)
    }, [])

    const value: string = useInputStore(modifiedName) ?? ""
    const stringValidation = (data: number) => {
        if (!stringify) {
            return data
        }
        else {
            return data.toString()
        }
    }

    const handleOnDisableChange = useCallback((value: any) => {
        setFieldValue({ [modifiedName]: value })
    }, [modifiedName])

    const disabledValue: boolean = useComputedExpression(disabled)

    const hiddenValue: boolean = useComputedExpression(hideElement)

    useEffect(() => {
        if (onDisableChange) {
            // const { inputData } = inputStore.getSnapshot()
            const currentDisabled = inputStore.getInputNestedValue(modifiedName)
            onDisableChange({
                state: disabledValue,
                disabledKey: name,
                disabledValue: currentDisabled,
                storeValue: inputStore.getSnapshot().inputData,
                setValue: handleOnDisableChange
            })
        }
    }, [disabledValue])

    const prevValueRef = useRef(value)
    useEffect(() => {
        if (!onChange) return
        if (value !== prevValueRef.current) {
            prevValueRef.current = value
            if (isIndex(value)) {
                onChange(Number(value))  // Pass null as no event.data
            }
        }
    }, [value])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value
        const newValue = inputVal === "" ? "" : stringValidation(Number(inputVal))
        // const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
        // onChange(newValue, nativeEvent.data);
        // fullProps.onInputChange(modifiedName, newValue)
        inputStore.setValue(modifiedName, newValue)
    }
    return (
        <InputTemplate
            ref={ref}
            name={modifiedName}
            value={value}
            handleChange={handleChange}
            autoFocus={autoFocus}
            maxLength={maxLength}
            onBlur={onBlur}
            onEnterPress={onEnterPress}
            placeholder={placeholder}
            type={privacy ? 'password' : 'number'}
            disabled={disabledValue}
            hideElement={hiddenValue}
            containerStyles={containerStyles}
            inputStyles={inputStyles}
            placeholderStyles={placeholderStyles}
            {...props}
        />
    )
})

// 1. Export the memoized component
const MemoizedNumInput = memo(NumInput)

// 2. Set the displayName on the exported component
MemoizedNumInput.displayName = 'NumInput';

export default MemoizedNumInput;

// export default memo(NumInput)
