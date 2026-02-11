import React, { type FC, forwardRef, memo, useEffect } from 'react';
import InputTemplate from './InputTemplate';
import { DateString, InputRefProps, type InputProps } from '../typeDeclaration/inputProps';
import { useComputedExpression } from '../hooks/useComputedExpression';
import { useFieldName } from '../hooks/useFieldName';
import { handleInitialValue } from '../Utils/setInitialValue';
import { inputStore } from 'src/store/InputStore';
import Input from './Input';

interface DateProps extends InputProps {
    onDateSelect?: (date: string) => void
    defaultTodayDate?: boolean
    defaultDate?: DateString
}

const DateInput: FC<DateProps> = forwardRef<InputRefProps, DateProps>(({
    placeholder,
    onDateSelect,
    onEnterPress = () => { },
    children,
    defaultTodayDate = true,
    disabled = false,
    style,
    hideElement = false,
    containerStyles = "",
    inputStyles = "",
    placeholderStyles = "",
    defaultDate,
    name,
}, ref) => {
    const modifiedName = useFieldName(placeholder, name)
    const todayDate = new Date().toISOString().split('T')[0]

    const initialDate = defaultTodayDate ? todayDate : defaultDate ?? ""
    useEffect(() => {
        handleInitialValue(modifiedName, initialDate)
    }, [])
    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        inputStore.setValue(modifiedName, newDate)
        // (props as FullInputProps).onInputChange(name!, newDate)
        onDateSelect?.(newDate)
    };

    const disabledValue: boolean = useComputedExpression(disabled)

    const hiddenValue: boolean = useComputedExpression(hideElement)

    if (hiddenValue) return null

    return (
        <div className={`relative ${containerStyles}`} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={modifiedName}
                placeholder={placeholder}
                style={style}
                childType='input'
                placeholderStyles={placeholderStyles}
            >
                <Input
                    ref={ref}
                    name={modifiedName}
                    placeholder={placeholder}
                    inputInlineStyle={style?.inputInlineStyle}
                    disabled={disabledValue}
                    type='date'
                    handleChange={handleDateSelect}
                    inputStyles={inputStyles}
                // {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
});

const memoizedDateInput = memo(DateInput)
memoizedDateInput.displayName = 'DateInput'
export default memoizedDateInput












// import React, { type FC, memo, useEffect } from 'react';
// // import PickDate from './PickDate';
// import { getDate } from '../functions/dateHelper';
// import { useInputStore } from '../hooks/useInputStore';
// import InputTemplate from './InputTemplate';
// import { type InputProps } from '../typeDeclaration/inputProps';
// import { useComputedExpression } from '../hooks/useComputedExpression';
// import { useFieldName } from '../hooks/useFieldName';
// import { handleInitialValue } from '../Utils/setInitialValue';
// import { inputStore } from 'src/store/InputStore';

// interface DateProps extends InputProps {
//     onDateSelect?: (date: string) => void
//     defaultTodayDate?: boolean
//     defaultDate?: string
// }

// const DateInput: FC<DateProps> = ({
//     placeholder,
//     onDateSelect,
//     onEnterPress = () => { },
//     defaultTodayDate = true,
//     disabled = false,
//     hideElement = false,
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     defaultDate,
//     name,
//     ...props
// }) => {
//     const modifiedName = useFieldName(placeholder, name)
//     const todayDate = new Date().toISOString().split('T')[0]

//     const initialDate = defaultTodayDate ? todayDate : ""
//     useEffect(() => {
//         handleInitialValue(modifiedName, initialDate)
//     }, [])
//     const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newDate = e.target.value;
//         inputStore.setValue(modifiedName, newDate)
//         // (props as FullInputProps).onInputChange(name!, newDate)
//         onDateSelect?.(newDate)
//     };

//     const value = useInputStore(modifiedName) ?? ""

//     const disabledValue: boolean = useComputedExpression(disabled)

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     return (
//         <>
//             <InputTemplate
//                 name={modifiedName}
//                 value={value}
//                 handleChange={handleDateSelect}
//                 onEnterPress={onEnterPress}
//                 placeholder={placeholder}
//                 disabled={disabledValue}
//                 hideElement={hiddenValue}
//                 type='date'
//                 containerStyles={containerStyles}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 {...props}
//             />
//         </>
//     );
// };

// const memoizedDateInput = memo(DateInput)
// memoizedDateInput.displayName = 'DateInput'
// export default memoizedDateInput

// export default memo(DateInput);
{/* <div className="relative w-full group border-2 rounded-lg">
    <input
        type="date"
        value={value}
        // defaultValue={initialDate}
        onChange={e => handleDateSelect(e.target.value)}
        id='customDate'
        className={'py-2 px-2 w-max bg-transparent appearance-none peer'} />
    <label
        htmlFor={'customDate'}
        className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
        >
        {placeholder}
    </label>
</div> */}
{/* <PickDate onDateSelect={handleDateSelect} id={'customDate'} dateStyles={'py-2 px-2 w-full bg-transparent appearance-none peer'} /> */ }