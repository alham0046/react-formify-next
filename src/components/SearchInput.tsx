import { forwardRef, memo, useEffect, useMemo, useRef, useState } from "react"
import { useFieldName } from "../hooks/useFieldName"
import { handleInitialValue } from "../Utils/setInitialValue"
import { useComputedExpression } from "../hooks/useComputedExpression"
import Input from "./Input"
import { useContainerContext } from "../context/ContainerContext"
import type { DropdownStyleProp, InputStyle, TWDropdownStyleProp, TWInputStyleProp } from "../typeDeclaration/stylesProps"
import { InputProps, InputRefProps } from "src/typeDeclaration/inputProps"
import { DEFAULT_DROPDOWN_STYLE } from "src/styles/DropdownStyles"
import { inputStore } from "src/store/InputStore"
import InputTemplate from "./InputTemplate"
import DropdownSearchModal from "./DropdownSearchModal"
import { resolveTwStyles } from "src/Utils/resolveTwStyles"
type SearchOnChange<T> = (
    value: string | number
) => T[] | Promise<T[]>


interface SearchInputProps<T> extends Exclude<InputProps, "onChange"> {
    onChange: SearchOnChange<T>
    twStyle?: Partial<TWDropdownStyleProp & TWInputStyleProp>
    style?: Partial<InputStyle & DropdownStyleProp>
    renderItem?: (item: T, index: number, active: boolean) => React.ReactNode
    onSelect?: (args: { value: any, setValue: (value: any) => void }) => void
}

const SearchInput = forwardRef<InputRefProps, SearchInputProps<any>>(({ ...props }, ref) => {
    const { placeholder, name, children, onChange, style,twStyle, renderItem, onSelect, initialValue = "", disabled = false, hideElement = false, privacy = false, ...rest } = props
    // const [search, setSearch] = useState<any[]>([])
    const timeOutObj = useRef<any>(null)
    const modifiedName = useFieldName(placeholder, name)

    useEffect(() => {
        handleInitialValue(modifiedName, initialValue)
    }, [])

    const {sharedDropdownStyles, sharedDropdownTw} = useContainerContext()

    const resolvedStyle: Partial<InputStyle & DropdownStyleProp> = useMemo(() => {
        if (!style) return sharedDropdownStyles
        return ({
            ...sharedDropdownStyles,
            ...style, // 👈 highest priority
        })
    },[sharedDropdownStyles, style])

    const tw = useMemo(() => {
        if (!twStyle) return sharedDropdownTw
        return (resolveTwStyles({
          defaultStyles: sharedDropdownTw,
          localStyles: twStyle, // from props
        }))
    }, [ sharedDropdownTw, twStyle])

    const {boxWidth, containerStyles, inputInlineStyle} = resolvedStyle

    const disabledValue: boolean = useComputedExpression(disabled, modifiedName)

    const hiddenValue: boolean = useComputedExpression(hideElement)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const changedValue = e.target.value
        clearTimeout(timeOutObj.current)
        timeOutObj.current = setTimeout(async () => {
            // setSearch(value as string)
            const searchedData = await onChange(changedValue)
            inputStore.setDropdownSearch(`d_${modifiedName}`, searchedData)
            // setSearch(searchedData)
        }, 800);
        inputStore.setValue(modifiedName, changedValue)
    }


    // const handleSelect = (value: string) => {
    //     // onChange(value)
    //     inputStore.setValue(modifiedName, value)
    //     onSelect?.(value)

    //     // setSearch([])
    // }

    if (hiddenValue) return null

    return (
        <div className={`relative ${tw.twContainerStyles}`} style={{...containerStyles, width: boxWidth}} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            <InputTemplate
                name={modifiedName}
                placeholder={placeholder}
                childType="input"
                style={resolvedStyle}
                placeholderStyles={tw.twPlaceholderStyles}
            >
                <Input
                    ref={ref}
                    name={modifiedName}
                    refRequired={true}
                    placeholder={placeholder}
                    // onChange={onValueChange}
                    inputInlineStyle={inputInlineStyle}
                    inputStyles={tw.twInputStyles}
                    disabled={disabledValue}
                    type={privacy ? 'password' : 'text'}
                    handleChange={handleChange}
                    {...rest}
                />
            </InputTemplate>
            <DropdownSearchModal onSelect={onSelect} twOptionBoxStyles={tw.twOptionBoxStyles!} twOptionItemStyles={tw.twOptionItemStyles!} renderItem={renderItem} name={modifiedName} dropdownOffset={resolvedStyle.dropdownOffset!} />
            {/* <DropdownSearchModal options={search} onSelect={handleSelect} open={search.length > 0} renderItem={renderItem} /> */}
            {children}
        </div>
    )
})

export default memo(SearchInput)






// import { forwardRef, memo, useEffect, useRef, useState } from "react"
// import type { InputProps, InputRefProps } from "../typeDeclaration/inputProps"
// import { useFieldName } from "../hooks/useFieldName"
// import { handleInitialValue } from "../Utils/setInitialValue"
// import { useComputedExpression } from "../hooks/useComputedExpression"
// import { inputStore } from "../InputStore"
// import InputTemplate from "./InputTemplate"
// import DropdownSearchModal from "./DropdownSearchModal"

// type SearchOnChange<T> = (
//     value: string | number
// ) => T[] | Promise<T[]>


// interface SearchInputProps<T> extends Exclude<InputProps, "onChange"> {
//     onChange: SearchOnChange<T>
//     renderItem?: (item: T, index: number, active: boolean) => React.ReactNode
//     onSelect?: (item: T) => void
// }

// const SearchInput = forwardRef<InputRefProps, SearchInputProps<any>>(({ ...props }, ref) => {
//     const { placeholder, name, children, onChange, renderItem, initialValue = "", disabled = false, hideElement = false, containerStyles = "", privacy = false, ...rest } = props
//     const [search, setSearch] = useState<any[]>([])
//     const timeOutObj = useRef<any>(null)
//     const modifiedName = useFieldName(placeholder, name)

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue)
//     }, [])
//     const disabledValue: boolean = useComputedExpression(disabled, modifiedName)

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const changedValue = e.target.value
//         clearTimeout(timeOutObj.current)
//         timeOutObj.current = setTimeout(async () => {
//             // setSearch(value as string)
//             const searchedData = await onChange(changedValue)
//             setSearch(searchedData)
//         }, 500);
//         // const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
//         // onChange?.(changedValue, nativeEvent.data);
//         inputStore.setValue(modifiedName, changedValue)
//     }

//     const onValueChange = (value: string | number) => {
//         if (value === "") return
//         // clearTimeout(timeOutObj.current)
//         // timeOutObj.current = setTimeout(async () => {
//         //     // setSearch(value as string)
//         //     const searchedData = await onChange(value)
//         //     setSearch(searchedData)
//         // }, 500);
//     }

//     const handleSelect = (value: string) => {
//         // onChange(value)
//         inputStore.setValue(modifiedName, value)
//         setSearch([])
//     }

//     if (hiddenValue) return null

//     return (
//         <div className={containerStyles} style={{ position: 'relative' }}>
//             <InputTemplate
//                 ref={ref}
//                 name={modifiedName}
//                 onChange={onValueChange}
//                 disabled={disabledValue}
//                 handleChange={handleChange}
//                 placeholder={placeholder}
//                 type={privacy ? 'password' : 'text'}
//                 {...rest}
//             />
//             <DropdownSearchModal options={search} onSelect={handleSelect} open={search.length > 0} renderItem={renderItem} />
//             {children}
//         </div>
//     )
// })

// export default memo(SearchInput)
