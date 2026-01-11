import React, { type FC, memo, useEffect } from 'react';
// import PickDate from './PickDate';
import { getDate } from '../functions/dateHelper';
import { useInputStore } from '../hooks/useInputStore';
import InputTemplate from './InputTemplate';
import { type InputProps } from '../typeDeclaration/inputProps';
import { useComputedExpression } from '../hooks/useComputedExpression';
import { useFieldName } from '../hooks/useFieldName';
import { handleInitialValue } from '../Utils/setInitialValue';
import { inputStore } from 'src/store/InputStore';

interface DateProps extends InputProps {
    onDateSelect?: (date: string) => {}
    defaultTodayDate?: boolean
    defaultDate?: string
}

const DateInput: FC<DateProps> = ({
    placeholder,
    onDateSelect,
    onEnterPress = () => { },
    defaultTodayDate = false,
    disabled = false,
    hideElement = false,
    containerStyles = "",
    inputStyles = "",
    placeholderStyles = "",
    defaultDate,
    name,
    ...props
}) => {
    const modifiedName = useFieldName(placeholder, name)
    const todayDate = new Date().toISOString()

    const initialDate = defaultTodayDate ? getDate(todayDate)!.getFormat('dd-mm-yyyy') : ""
    useEffect(() => {
        handleInitialValue(modifiedName, initialDate)
    }, [])
    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        inputStore.setValue(modifiedName, newDate)
        // (props as FullInputProps).onInputChange(name!, newDate)
        onDateSelect?.(newDate)
    };

    const value = useInputStore(modifiedName) ?? ""

    const disabledValue: boolean = useComputedExpression(disabled)

    const hiddenValue: boolean = useComputedExpression(hideElement)

    return (
        <>
            <InputTemplate
                name={modifiedName}
                value={value}
                handleChange={handleDateSelect}
                onEnterPress={onEnterPress}
                placeholder={placeholder}
                disabled={disabledValue}
                hideElement={hiddenValue}
                type='date'
                containerStyles={containerStyles}
                inputStyles={inputStyles}
                placeholderStyles={placeholderStyles}
                {...props}
            />
        </>
    );
};

const memoizedDateInput = memo(DateInput)
memoizedDateInput.displayName = 'DateInput'
export default memoizedDateInput

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