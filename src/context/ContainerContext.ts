import { createContext, useContext } from "react";

interface ContainerContextProps {
    sharedStyles?: Record<string, any>;
    modalContainerRef?: React.RefObject<HTMLDivElement>
}

export const ContainerContext = createContext<ContainerContextProps | null>(null);

export const useContainerContext = () => {
    const ctx = useContext(ContainerContext)
    if (!ctx) {
    throw new Error('Modal components must be used inside <Modal>')
  }
  return ctx
}