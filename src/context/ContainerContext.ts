import { createContext, useContext } from "react";
import { DropdownStyleProp, InputStyle, TWDropdownStyleProp, TWInputStyleProp } from "src/typeDeclaration/stylesProps";

interface ContainerContextProps {
  sharedStyles: Partial<InputStyle>
  sharedDropdownStyles: Partial<InputStyle & DropdownStyleProp>
  sharedTw: Partial<TWInputStyleProp>
  sharedDropdownTw: Partial<TWInputStyleProp & TWDropdownStyleProp>
  modalContainerRef?: React.RefObject<HTMLDivElement>
}

export const ContainerContext = createContext<ContainerContextProps>({ sharedStyles: {}, sharedDropdownStyles: {}, sharedDropdownTw: {}, sharedTw: {}, modalContainerRef: undefined });

export const useContainerContext = () => {
  return useContext(ContainerContext)
}
// import { createContext, useContext } from "react";

// interface ContainerContextProps {
//     sharedStyles?: Record<string, any>;
//     modalContainerRef?: React.RefObject<HTMLDivElement>
// }

// export const ContainerContext = createContext<ContainerContextProps | null>(null);

// export const useContainerContext = () => {
//     const ctx = useContext(ContainerContext)
//     if (!ctx) {
//     throw new Error('Modal components must be used inside <Modal>')
//   }
//   return ctx
// }