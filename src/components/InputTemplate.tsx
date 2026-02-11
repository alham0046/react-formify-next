import React, { type ComponentProps, forwardRef, memo, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import type { InputRefProps } from '../typeDeclaration/inputProps'
import { inputStore } from 'src/store/InputStore'
import { DEFAULT_INPUT_STYLE, InputStyle } from 'src/typeDeclaration/stylesProps'
import { useFormLayout } from 'src/context/LabelLayoutContext'
import { useContainerContext } from 'src/context/ContainerContext'

interface FullTemplateProps {
    name: string
    children: React.ReactNode
    childType: 'input' | 'dropdown'
    placeholder: string
    style?: Partial<InputStyle>
    placeholderStyles?: string
}

type TemplateProps = Omit<FullTemplateProps, "sharedStyles">

const InputTemplate = forwardRef<InputRefProps, TemplateProps>(({
    name,
    children,
    childType,
    placeholder,
    style,
    placeholderStyles = "",
}, ref) => {
    const { sharedStyles } = useContainerContext()
    const resolvedStyle: InputStyle = {
        ...DEFAULT_INPUT_STYLE,
        ...sharedStyles,
        ...style, // 👈 highest priority
    }

    const { borderWidth, boxHeight, boxWidth, placeHolderOffset, inputInlineStyle, placeholderInlineStyle } = resolvedStyle
    const { labelMode } = useFormLayout()
    const bgColor = inputStore.backgroundColor

    return (
        <div
            className={`relative w-full group input-root`} /* onFocus={() => setFocusInputKey(name)} */
            style={{ ['--bw' as any]: borderWidth, ['--bh' as any]: boxHeight, ['--po' as any]: placeHolderOffset, ['--float' as any]: childType === 'dropdown' ? 1 : 0 }}
        >
            {children}
            {!labelMode && <label
                id={`floating_input_${name}`}
                htmlFor={`floating_input_${name}`}
                className={`
                            label-input h-full
                          `}
            >
                {/* BORDER CUT MASK */}
                <span
                    className="line-input"
                    style={{
                        backgroundColor: bgColor || 'white',
                    }}
                />

                {/* TEXT */}
                <span className={`placeholder-input h-full ${placeholderStyles}`} style={placeholderInlineStyle}>{placeholder}</span>
            </label>}
        </div>
    )
})

export default memo(InputTemplate)







// import React, { type ComponentProps, forwardRef, memo, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
// import type { InputRefProps } from '../typeDeclaration/inputProps'
// import { inputStore } from 'src/store/InputStore'

// interface FullTemplateProps {
//     name: string
//     type: ComponentProps<'input'>['type']
//     placeholder: string
//     autoFocus?: boolean
//     maxLength?: number
//     onBlur?: (args: { currentValue?: string, allData?: Record<string, any> }) => void
//     onFocus?: (key: string) => void
//     onEnterPress?: (args: { currentValue?: string, allData?: Record<string, any> }) => void
//     disabled?: boolean
//     hideElement?: boolean
//     value: string
//     handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     containerStyles?: string
//     inputStyles?: string
//     placeholderStyles?: string
//     // bgColor: string
//     sharedStyles?: {
//         placeholderStyles?: string
//         [key: string]: any
//     }
// }

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles">

// const InputTemplate = forwardRef<InputRefProps, TemplateProps>(({
//     name,
//     type,
//     placeholder,
//     maxLength,
//     value,
//     onBlur,
//     autoFocus,
//     onEnterPress,
//     onFocus,
//     disabled = false,
//     hideElement = false,
//     handleChange = () => { },
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     ...props
// }, ref) => {
//     // const setFocusInputKey = useInputStore((state) => state.setCurrentInputKey);
//     const pattern = /border-(\d+|\[([^\]]+)\])/
//     const inputRef = useRef<HTMLInputElement>(null)
//     const match = inputStyles.match(pattern)
//     const dynamicHeight = match ? (match[2] ? match[2] : `${match[1]}px`) : undefined;
//     const labelRef = useRef<any>("")
//     const bgColor = inputStore.backgroundColor
//     const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const evalue = e.target.value
//         // inputStore.currentValue = evalue
//         if (maxLength && evalue.length == maxLength + 1) {
//             return
//         }
//         // inputStore.setValue(name, e.target.value)
//         handleChange(e)
//     }

//     useImperativeHandle(ref, () => ({
//         focus: () => {
//             inputRef.current?.focus()
//         },
//         blur: () => {
//             inputRef.current?.blur()
//         },
//         reset: () => {
//             inputStore.reset()(name)
//         }
//     }))

//     const handleBlur = () => {
//         const data = inputStore.getSnapshot().inputData
//         onBlur?.({ currentValue: value ?? "", allData: data as Record<string, any> })
//     }
//     const handleFocus = () => {
//         onFocus?.(name)
//     }
//     const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             const data = inputStore.getSnapshot()
//             onEnterPress?.({ currentValue: value ?? "", allData: data as Record<string, any> })
//         }
//     }
//     const [labelWidth, setLabelWidth] = useState<number | null>(null);

//     useLayoutEffect(() => {
//         if (labelRef.current) {
//             setLabelWidth(labelRef.current.offsetWidth);
//         }
//     }, [value, placeholder, hideElement]);
//     return (
//         <div className={`relative w-full group ${containerStyles}`} /* onFocus={() => setFocusInputKey(name)} */>
//             <input
//                 type={type}
//                 id={`floating_input_${name}`}
//                 ref={inputRef}
//                 onBlur={handleBlur}
//                 onFocus={handleFocus}
//                 value={value}
//                 maxLength={maxLength}
//                 autoFocus={autoFocus}
//                 onKeyDown={handleKeyPresses}
//                 onChange={handlePreInput}
//                 className={`py-2 px-2 border-2 w-full outline-none rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
//                 placeholder=" "
//                 disabled={disabled}
//                 required
//             />
//             {labelWidth && (
//                 <div
//                     className='absolute top-0 left-4 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 transition-opacity duration-200'
//                     style={{
//                         height: dynamicHeight || 2,
//                         width: labelWidth * 0.75 + 8,
//                         backgroundColor: bgColor || 'white'
//                     }}
//                 />
//             )}
//             <label
//                 ref={labelRef}
//                 htmlFor={`floating_input_${name}`}
//                 className={`
//                     absolute left-5 duration-300 transform -translate-y-5 scale-75 top-2 origin-left
//                     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
//                     peer-focus:scale-75 peer-focus:-translate-y-5
//                     ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''} ${placeholderStyles}
//                     `}
//             >
//                 {placeholder}
//             </label>
//         </div>
//     )
// })

// export default memo(InputTemplate)





// import React, { ComponentProps, memo, useLayoutEffect, useRef, useState } from 'react'
// import { useInputStore } from 'src/hooks/useInputStore'
// import { inputStore } from 'src/InputStore'

// interface FullTemplateProps {
//     name: string
//     type: ComponentProps<'input'>['type']
//     placeholder: string
//     maxLength?: number
//     onBlur?: (args: { currentValue: string, allData: Record<string, any> }) => void
//     onEnterPress?: (args: { currentValue: string, allData: Record<string, any> }) => void
//     disabled?: boolean
//     hideElement?: boolean
//     value: string
//     handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     containerStyles?: string
//     inputStyles?: string
//     placeholderStyles?: string
//     // bgColor: string
//     sharedStyles?: {
//         placeholderStyles?: string
//         [key: string]: any
//     }
// }

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

// const InputTemplate: React.FC<TemplateProps> = ({
//     name,
//     type,
//     placeholder,
//     maxLength,
//     value,
//     onBlur = () => { },
//     onEnterPress = () => { },
//     disabled = false,
//     hideElement = false,
//     handleChange = () => { },
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     ...props
// }) => {
//     const setFocusInputKey = useInputStore((state) => state.setCurrentInputKey);
//     const pattern = /border-(\d+|\[([^\]]+)\])/
//     const match = inputStyles.match(pattern)
//     const dynamicHeight = match ? (match[2] ? match[2] : `${match[1]}px`) : undefined;
//     const labelRef = useRef<any>("")
//     const bgColor = inputStore.backgroundColor
//     const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const evalue = e.target.value
//         if (maxLength && evalue.length == maxLength + 1) {
//             return
//         }
//         handleChange(e)
//     }
//     const handleBlur = () => {
//         const { inputData: data } = useInputStore.getState()
//         onBlur({currentValue : value, allData : data})
//     }
//     const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             const { inputData: data } = useInputStore.getState()
//             onEnterPress({currentValue : value, allData : data})
//         }
//     }
//     const [labelWidth, setLabelWidth] = useState<number | null>(null);

//     useLayoutEffect(() => {
//         if (labelRef.current) {
//             setLabelWidth(labelRef.current.offsetWidth);
//         }
//     }, [value, placeholder, hideElement]);
//     return (
//         <div className={`relative w-full group ${containerStyles}`} onFocus={() => setFocusInputKey(name)}>
//             <input
//                 type={type}
//                 id={`floating_input_${name}`}
//                 onBlur={handleBlur}
//                 value={value}
//                 maxLength={maxLength}
//                 onKeyDown={handleKeyPresses}
//                 onChange={handlePreInput}
//                 className={`py-2 px-2 border-2 w-full outline-none rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
//                 placeholder=" "
//                 disabled={disabled}
//                 required
//             />
//             {labelWidth && (
//                 <div
//                     className='absolute top-0 left-4 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 transition-opacity duration-200'
//                     style={{
//                         height: dynamicHeight || 2,
//                         width: labelWidth * 0.75 + 8,
//                         backgroundColor: bgColor || 'white'
//                     }}
//                 />
//             )}
//             <label
//                 ref={labelRef}
//                 htmlFor={`floating_input_${name}`}
//                 className={`
//                     absolute left-5 duration-300 transform -translate-y-5 scale-75 top-2 origin-left
//                     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
//                     peer-focus:scale-75 peer-focus:-translate-y-5
//                     ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''} ${placeholderStyles}
//                     `}
//             >
//                 {placeholder}
//             </label>
//         </div>
//     )
// }

// export default memo(InputTemplate)