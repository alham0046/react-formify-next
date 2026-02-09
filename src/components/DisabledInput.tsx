import  { type FC, memo, useEffect } from 'react';
import InputTemplate from './InputTemplate';
import { useFieldName } from '../hooks/useFieldName';
import { handleInitialValue } from '../Utils/setInitialValue';
import { useComputedExpression } from 'src/hooks/useComputedExpression';
import { InputStyle } from 'src/typeDeclaration/stylesProps';
import Input from './Input';

interface FullDisabledProps {
    initialValue?: string;
    containerStyles?: string;
    children?: React.ReactNode;
    inputStyles?: string;
    placeholderStyles?: string;
    placeholder: string;
    style?: Partial<InputStyle>
    privacy?: boolean
    hideElement?: string | boolean
    onChange?: (value: string | number) => void
    name?: string;
}

type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;

const DisabledInput: FC<DisabledInputProps> = ({
    initialValue = "",
    containerStyles = "",
    privacy = false,
    children,
    style,
    placeholder,
    hideElement = false,
    placeholderStyles,
    name,
    ...rest
}) => {
    const modifiedName = useFieldName(placeholder, name)

    useEffect(() => {
        handleInitialValue(modifiedName, initialValue)
    }, [])

    const hiddenValue: boolean = useComputedExpression(hideElement)

    if (hiddenValue) {
        return null;
    }


    return (
        <div className={`relative ${containerStyles}`} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={modifiedName}
                placeholder={placeholder}
                style={style}
                placeholderStyles={placeholderStyles}
            >
                <Input
                    name={modifiedName}
                    placeholder={placeholder}
                    inputInlineStyle={style?.inputInlineStyle}
                    disabled={true}
                    type={privacy ? 'password' : 'text'}
                    fixedValue={initialValue}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
};

// 1. Export the memoized component
const MemoizedDisabledInput = memo(DisabledInput)

// 2. Set the displayName on the exported component
MemoizedDisabledInput.displayName = 'DisabledInput';

export default MemoizedDisabledInput;








// import  { type FC, memo, useEffect } from 'react';
// import InputTemplate from './InputTemplate';
// import { useFieldName } from '../hooks/useFieldName';
// import { handleInitialValue } from '../Utils/setInitialValue';

// interface FullDisabledProps {
//     initialValue?: string;
//     containerStyles?: string;
//     inputStyles?: string;
//     placeholderStyles?: string;
//     placeholder: string;
//     onChange?: (value: string | number, data: string | null) => void
//     name?: string;
//     isArrayObject?: boolean;
//     arrayData?: {
//         arrayName: string;
//         arrayIndex: number;
//     };
//     onInputChange: (name: string, value: string) => void;
// }

// type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;

// const DisabledInput: FC<DisabledInputProps> = ({
//     initialValue = "",
//     containerStyles = "",
//     placeholder,
//     onChange = () => { },
//     inputStyles,
//     placeholderStyles,
//     name,
//     ...props
// }) => {
//     const modifiedName = useFieldName(placeholder, name)

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue)
//     }, [])

//     // const value = useInputStore(modifiedName)

//     useEffect(() => {
//         onChange(initialValue, null)
//         // inputStore.setValue(modifiedName, initialValue);
//     }, [modifiedName]);

//     return (
//         <>
//             <InputTemplate
//                 name={name!}
//                 value={initialValue}
//                 placeholder={placeholder}
//                 disabled={true}
//                 type='text'
//                 containerStyles={containerStyles}
//                 inputStyles={`bg-gray-300 ${inputStyles}`}
//                 placeholderStyles={placeholderStyles}
//                 {...props}
//             />
//         </>
//     );
// };

// // 1. Export the memoized component
// const MemoizedDisabledInput = memo(DisabledInput)

// // 2. Set the displayName on the exported component
// MemoizedDisabledInput.displayName = 'DisabledInput';

// export default MemoizedDisabledInput;











// export default memo(DisabledInput);
{/* <input
    type="text"
    id={`floating_input_${modifiedName}`}
    value={value}
    className="py-2 px-2 border-2 w-full rounded-lg bg-transparent appearance-none peer"
    placeholder=" "
    required
    disabled
/>
<label
    htmlFor={`floating_input_${modifiedName}`}
    className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
>
    {placeholder}
</label> */}