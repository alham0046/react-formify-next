import { useLayoutEffect, useState } from "react"

interface PositionProp {
    fixedRef: React.RefObject<HTMLDivElement | null>
    modalRef: React.RefObject<HTMLDivElement | null>
    dropdownOffset?: number
    isOpen: boolean
}

export const useDropdownPosition = ({ fixedRef, modalRef, dropdownOffset = 0, isOpen }: PositionProp) => {
    const [position, setPosition] = useState<{ top?: number; left?: number; width?: number; } | undefined>(undefined);
    useLayoutEffect(() => {
        if (isOpen) {
            calculatePosition()
        }
    }, [isOpen])
    const calculatePosition = () => {
        const inputRect = fixedRef.current?.getBoundingClientRect();
        const modalRect = modalRef.current?.getBoundingClientRect();
        const innerHeight = window.innerHeight

        if (!inputRect || !modalRect) return;


        const spaceBelow = innerHeight - inputRect.bottom;
        // const spaceAbove = inputRect.top


        const direction =
            spaceBelow > modalRect.height
                ? "down"
                : "up"


        // const scrollOffset = window.scrollY
        const top = direction === "down"
            ? inputRect.bottom + (dropdownOffset)
            : inputRect.top - modalRect.height - (dropdownOffset)

        setPosition({
            left: inputRect.left,
            width: inputRect.width,
            top
        });
    }

    return { position, calculatePosition }
}