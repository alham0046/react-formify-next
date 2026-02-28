import { useCallback, useEffect, useMemo, useRef } from "react"
import type { DropdownOption } from "../components/BaseDropdown"
import { useDropdownContext } from "src/context/DropdownContext"
import { createStyleStrategy } from "src/Utils/styleStrategy"

export function useDropdownNavigation(options: (DropdownOption | string)[], close: () => void) {
  const optionLength = options.length
  const highlightIndexRef = useRef(-1)
  const optionRefs = useRef<HTMLDivElement[]>([])

  const resetRef = () => {
    highlightIndexRef.current = -1
  }

  const { twHighlightedStyles, highlightedStyle } = useDropdownContext()
  const strategy = useMemo(
    () => createStyleStrategy(twHighlightedStyles, highlightedStyle),
    [twHighlightedStyles, highlightedStyle]
  );

  const reset = () => {
    // highlightIndexRef.current = 0
    strategy.remove()
    optionRefs.current = []
    // strategy.remove()
  }
  const updateHighlight = useCallback((next: number) => {
    if (!optionLength) return

    const prev = highlightIndexRef.current
    if (prev === next) return

    const nextEl = optionRefs.current[next]

    strategy.swap(nextEl)
    nextEl?.scrollIntoView({ block: "nearest" })

    highlightIndexRef.current = next
  }, [optionLength])

  const handleKeyDown = (
    e: KeyboardEvent | React.KeyboardEvent,
    onSelect: (item: string | DropdownOption) => void
  ) => {
    if (!options.length) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      updateHighlight(
        Math.min(highlightIndexRef.current + 1, options.length - 1)
      )
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      updateHighlight(
        Math.max(highlightIndexRef.current - 1, 0)
      )
    }

    if (e.key === "Enter") {
      e.preventDefault()
      const item = options[highlightIndexRef.current]
      // strategy.remove()
      item && onSelect(item)
    }

    if (e.key === "Escape") {
      // strategy.remove()
      close()
    }
  }

  const registerOption = (index: number) => (el: HTMLDivElement | null) => {
    if (!el) return

    optionRefs.current[index] = el

    if (index === 0) {
      resetRef()
      updateHighlight(0)
    }
  }

  return {
    highlightIndexRef,
    handleKeyDown,
    registerOption,
    updateHighlight,
    reset,
  }
}






// import { useRef } from "react"
// import type { DropdownOption } from "../components/BaseDropdown"

// export function useDropdownNavigation(options: (DropdownOption | string)[], close: () => void) {
//   const highlightIndexRef = useRef(0)
//   const optionRefs = useRef<HTMLDivElement[]>([])

//   const reset = () => {
//     highlightIndexRef.current = 0
//   }

//   const updateHighlight = (next: number) => {
//     if (!options.length) return

//     const prev = highlightIndexRef.current
//     if (prev === next) return

//     optionRefs.current[prev]?.classList.remove("bg-gray-100")
//     optionRefs.current[next]?.classList.add("bg-gray-100")
//     optionRefs.current[next]?.scrollIntoView({ block: "nearest" })

//     highlightIndexRef.current = next
//   }

//   const handleKeyDown = (
//     e: KeyboardEvent | React.KeyboardEvent,
//     onSelect: (item: string | DropdownOption) => void
//   ) => {
//     if (!options.length) return

//     if (e.key === "ArrowDown") {
//       e.preventDefault()
//       updateHighlight(
//         Math.min(highlightIndexRef.current + 1, options.length - 1)
//       )
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault()
//       updateHighlight(
//         Math.max(highlightIndexRef.current - 1, 0)
//       )
//     }

//     if (e.key === "Enter") {
//       e.preventDefault()
//       const item = options[highlightIndexRef.current]
//       item && onSelect(item)
//     }

//     if (e.key === "Escape") {
//       reset()
//       close()
//     }
//   }

//   const registerOption = (index: number) => (el: HTMLDivElement | null) => {
//     if (el) optionRefs.current[index] = el
//   }

//   return {
//     highlightIndexRef,
//     handleKeyDown,
//     registerOption,
//     reset,
//   }
// }
