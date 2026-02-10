import { forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef, type ComponentProps } from 'react'
import { useInputStore } from '../hooks/useInputStore'
import type { InputRefProps } from '../typeDeclaration/inputProps'
import { useFormLayout } from 'src/context/LabelLayoutContext'
import { inputStore } from 'src/store/InputStore'
import { inputStylesStore } from 'src/store/styleStore'
import { FieldVisualState } from 'src/typeDeclaration/fieldVisualState'
interface InputProps {
    onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    onFocus?: (key: string) => void
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange?: (value: string | number) => void
    onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    fixedValue?: string
    maxLength?: number
    autoFocus?: boolean
    inputStyles?: string
    disabled: boolean
    placeholder: string
    type: ComponentProps<'input'>['type']
    name: string
    inputInlineStyle?: Omit<
        React.CSSProperties,
        'border' | 'borderWidth'
    >
}
const Input = forwardRef<InputRefProps, InputProps>(({
    name,
    fixedValue,
    maxLength,
    autoFocus=false,
    onBlur,
    onFocus,
    inputStyles="",
    handleChange,
    onChange,
    onEnterPress,
    disabled,
    placeholder,
    type,
    inputInlineStyle
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const {labelMode} = useFormLayout()
    const value: string | number = fixedValue ?? useInputStore(name) ?? ""
    const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('the string value is', e.target.value)
        const evalue = e.target.value
        // inputStore.currentValue = evalue
        if (maxLength && evalue.length == maxLength + 1) {
            return
        }
        // inputStore.setValue(name, e.target.value)
        handleChange?.(e)
    }

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus()
        },
        blur: () => {
            inputRef.current?.blur()
        },
        reset: () => {
            inputStore.reset()(name)
        }
    }))


    const handleBlur = () => {
        // console.log('blurred')
        inputStylesStore.disable(name, FieldVisualState.Focus)
        const data = inputStore.getSnapshot().inputData
        onBlur?.({ currentValue: value ?? "", allData: data as Record<string, any> })
    }
    const handleFocus = () => {
        inputStylesStore.enable(name, FieldVisualState.Focus)
        // console.log('blurred')
        onFocus?.(name)
    }

    const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log('enter pressed')
            const data = inputStore.getSnapshot().inputData
            onEnterPress?.({ currentValue: value ?? "", allData: data as Record<string, any> })
        }
    }

    useEffect(() => {
        onChange?.(value)
    }, [value])

    useLayoutEffect(() => {
        if (!inputRef.current) return

        inputStylesStore.register(name, inputRef.current)

        return () => {
            inputStylesStore.unregister(name)
        }
    }, [name])
    return (
        <input
            type={type}
            id={`floating_input_${name}`}
            ref={inputRef}
            onBlur={handleBlur}
            onFocus={handleFocus}
            value={value}
            maxLength={maxLength}
            autoFocus={autoFocus}
            onKeyDown={handleKeyPresses}
            onChange={handlePreInput}
            style={inputInlineStyle}
            className={labelMode ? inputStyles : `w-full outline-none rounded-lg input-border bg-transparent appearance-none peer ${inputStyles}`}
            placeholder={labelMode ? placeholder : " "}
            disabled={disabled}
            required
        />
    )
})

export default memo(Input)
