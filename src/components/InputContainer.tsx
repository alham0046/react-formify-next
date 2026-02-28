import React, { CSSProperties, type FC, type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { memo } from 'react'
import { ContainerContext } from 'src/context/ContainerContext';
import { inputStore } from 'src/store/InputStore';
import { DEFAULT_DROPDOWN_STYLE, TW_DEFAULT_DROPDOWN_STYLE } from 'src/styles/DropdownStyles';
import { DEFAULT_INPUT_STYLE, TW_DEFAULT_INPUT_STYLE } from 'src/styles/InputStyles';
import { InputStyle, TWInputStyleProp } from 'src/typeDeclaration/stylesProps';
import { resolveTwStyles } from 'src/Utils/resolveTwStyles';

interface InputContainerProps {
  children: ReactNode;
  style?: CSSProperties
  className?: string
  mode?: "default" | "edit"
  sharedStyles?: Partial<InputStyle>
  // sharedStyles?: object
  // sharedStyles?: {
  //   placeholderStyles?: string
  //   inputStyles?: string
  //   [key: string]: any
  // }
  sharedTwStyles?: Partial<TWInputStyleProp>
  modalContainerRef?: RefObject<HTMLDivElement>
}

interface InputChildProps {
  onInputChange: (modifiedName: string, value: any) => void;
  [key: string]: any; // optional if child has more props
}

const InputContainer: FC<InputContainerProps> = ({ children, className,style, sharedStyles, sharedTwStyles, modalContainerRef, mode = "default" }) => {

  const containerRef = useRef<HTMLDivElement | null>(null)

  const initialRender = useRef(true)

  if (initialRender.current) {
    inputStore.initializeInputStore(mode)
    initialRender.current = false
  }

  const tw = useMemo(() => {
    if (!sharedTwStyles) return TW_DEFAULT_INPUT_STYLE
    return (resolveTwStyles({
      defaultStyles: TW_DEFAULT_INPUT_STYLE,
      localStyles: sharedTwStyles, // from props
    }))
  }, [sharedTwStyles])

  const resolvedStyle: InputStyle = useMemo(() => {
    if (!sharedStyles) return DEFAULT_INPUT_STYLE
    return {
      ...DEFAULT_INPUT_STYLE,
      ...sharedStyles,
    }
  }, [sharedStyles])

  /**
   * Provide stable context reference
   */
  const contextValue = useMemo(() => ({
    sharedStyles: resolvedStyle,
    sharedDropdownStyles: {...DEFAULT_DROPDOWN_STYLE, ...resolvedStyle},
    sharedTw: tw,
    sharedDropdownTw: {...TW_DEFAULT_DROPDOWN_STYLE, ...tw},
    modalContainerRef,
  }), [resolvedStyle, tw, modalContainerRef])

  /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
  useEffect(() => {
    if (containerRef.current instanceof HTMLElement) {
      let current: HTMLElement | null = containerRef.current;
      // let backgroundColor: string | null = null;
      let backgroundColor: string = '';

      while (current) {
        const style = window.getComputedStyle(current);
        // const bg = style.backgroundColor;
        backgroundColor = style.backgroundColor;
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
          // backgroundColor = bg
          break; // found non-transparent background
        }
        current = current.parentElement;
      }
      if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') inputStore.setBackgroundColor('white')
      else inputStore.setBackgroundColor(backgroundColor)
    }
    return () => {
      inputStore.reset()()
    }
  }, []);

  return (
    <ContainerContext.Provider value={contextValue}>
      <div ref={containerRef} style={style} className={className}>
        {children}
      </div>
    </ContainerContext.Provider>
  )
}

export default memo(InputContainer)




////// backup on 27/02/2026 to redesign the way of styling
// import React, { type FC, type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { memo } from 'react'
// import { ContainerContext } from 'src/context/ContainerContext';
// import { inputStore } from 'src/store/InputStore';

// interface InputContainerProps {
//   children: ReactNode;
//   inputContainerStyles?: string;
//   mode?: "default" | "edit"
//   // sharedStyles?: object
//   sharedStyles?: {
//     placeholderStyles?: string
//     inputStyles?: string
//     [key: string]: any
//   }
//   modalContainerRef?: RefObject<HTMLDivElement>
// }

// interface InputChildProps {
//   onInputChange: (modifiedName: string, value: any) => void;
//   [key: string]: any; // optional if child has more props
// }

// const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles, modalContainerRef, mode = "default" }) => {

//   const containerRef = useRef<HTMLDivElement | null>(null)

//   const initialRender = useRef(true)

//   if (initialRender.current) {
//     inputStore.initializeInputStore(mode)
//     initialRender.current = false
//   }

//   /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
//   useEffect(() => {
//     if (containerRef.current instanceof HTMLElement) {
//       let current: HTMLElement | null = containerRef.current;
//       // let backgroundColor: string | null = null;
//       let backgroundColor: string = '';

//       while (current) {
//         const style = window.getComputedStyle(current);
//         // const bg = style.backgroundColor;
//         backgroundColor = style.backgroundColor;
//         if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//           // backgroundColor = bg
//           break; // found non-transparent background
//         }
//         current = current.parentElement;
//       }
//       if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') inputStore.setBackgroundColor('white')
//       else inputStore.setBackgroundColor(backgroundColor)
//     }
//     return () => {
//       inputStore.reset()()
//     }
//   }, []);

//   return (
//     <ContainerContext.Provider value={{ sharedStyles, modalContainerRef }}>
//       <div ref={containerRef} className={inputContainerStyles}>
//         {children}
//       </div>
//     </ContainerContext.Provider>
//   )
// }

// export default memo(InputContainer)




// import React, { FC, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { memo } from 'react'
// import { useInputStore } from '../hooks/useInputStore'
// import { camelCase } from 'src/functions/camelCase';
// import { flattenChildren } from 'src/Utils/flattenChildren';
// import { handleInitialValue } from 'src/Utils/setInitialValue';

// interface InputContainerProps {
//   children: ReactNode;
//   inputContainerStyles?: string;
//   // sharedStyles?: object
//   sharedStyles?: {
//     placeholderStyles?: string
//     inputStyles?: string
//     [key: string]: any
//   }
//   modalContainerRef?: RefObject<HTMLDivElement>
// }

// interface InputChildProps {
//   onInputChange: (modifiedName: string, value: any) => void;
//   [key: string]: any; // optional if child has more props
// }

// const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles, modalContainerRef }) => {
//   const setInputValue = useInputStore((state) => state.setInputValue)

//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const [bgColor, setBgColor] = useState("");

//   const handleInputChange = (modifiedName: string, value: any): void => {
//     setInputValue(modifiedName, value)
//   }
//   const childrenArray = useMemo(() => flattenChildren(children), [children]);

//   /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
//   useEffect(() => {
//     if (containerRef.current instanceof HTMLElement) {
//       let current: HTMLElement | null = containerRef.current;
//       // let backgroundColor: string | null = null;
//       let backgroundColor: string = '';

//       while (current) {
//         const style = window.getComputedStyle(current);
//         // const bg = style.backgroundColor;
//         backgroundColor = style.backgroundColor;
//         if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//           // backgroundColor = bg
//           break; // found non-transparent background
//         }
//         current = current.parentElement;
//       }
//       if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') setBgColor('white')
//       else setBgColor(backgroundColor)
//       // setBgColor(backgroundColor ?? 'white')
//       // setContainerBgColor(backgroundColor || 'white'); // fallback just in case
//     }
//   }, []);

//   return (
//     <div ref={containerRef} className={inputContainerStyles}>
//       {
//         // React.Children.map(children, (child) => {
//         childrenArray.map((child, index) => {
//           if (!React.isValidElement<InputChildProps>(child)) return null;
//           const childType = child.type
//           // const childSafe = child as React.ReactElement<InputChildProps>
//           const isDOMElement = typeof childType === 'string';
//           if (isDOMElement) return child;
//           const childProps = child.props
//           const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
//           if (childProps.placeholder) {
//             handleInitialValue(modifiedName, childProps.initialValue, setInputValue, (childType as any).type.name)
//           }
//           if (React.isValidElement(child)) {
//             return React.cloneElement(child, {
//               key: child.key ?? index,
//               onInputChange: handleInputChange,
//               name: modifiedName,
//               sharedStyles,
//               bgColor,
//               modalContainerRef
//             })
//           }
//           return child
//         })
//       }
//     </div>
//   )
// }

// export default memo(InputContainer)