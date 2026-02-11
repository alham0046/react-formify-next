import { useRef } from "react"
import type { DropdownOption } from "../components/BaseDropdown"

export function useDropdownNavigation(options: (DropdownOption | string)[], close: () => void) {
  const highlightIndexRef = useRef(0)
  const optionRefs = useRef<HTMLDivElement[]>([])

  const reset = () => {
    highlightIndexRef.current = 0
  }

  const updateHighlight = (next: number) => {
    if (!options.length) return

    const prev = highlightIndexRef.current
    if (prev === next) return

    optionRefs.current[prev]?.classList.remove("bg-gray-100")
    optionRefs.current[next]?.classList.add("bg-gray-100")
    optionRefs.current[next]?.scrollIntoView({ block: "nearest" })

    highlightIndexRef.current = next
  }

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
      item && onSelect(item)
    }

    if (e.key === "Escape") {
      reset()
      close()
    }
  }

  const registerOption = (index: number) => (el: HTMLDivElement | null) => {
    if (el) optionRefs.current[index] = el
  }

  return {
    highlightIndexRef,
    handleKeyDown,
    registerOption,
    reset,
  }
}
