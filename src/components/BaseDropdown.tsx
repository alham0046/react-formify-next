import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDropdownNavigation } from "../hooks/useDropdownNavigation"
import { useDropdownPosition } from "../hooks/useDropdownPosition"
import DropdownItem from "./DropdownItem";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface BaseDropdownProps {
  open: boolean
  options: DropdownOption[] | string[]
  onSelect: (item: string | DropdownOption) => void
  close: () => void
  inputRef: React.RefObject<HTMLDivElement | null>
  dropdownOffset?: number
  renderItem: (
    item: string | DropdownOption,
    index: number,
    highlighted: boolean,
    ref: (el: HTMLDivElement | null) => void
  ) => React.ReactNode
  searchable?: boolean
  onSearchChange?: (v: string) => void
  // position?: {
  //   top?: number
  //   bottom?: number
  //   left?: number
  //   width?: number
  // }
  className?: string
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  open,
  options,
  onSelect,
  close,
  renderItem,
  inputRef,
  dropdownOffset = 0,
  searchable,
  onSearchChange,
  // position,
  className = "",
}) => {
  const [search, setSearch] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const { position, calculatePosition } = useDropdownPosition({
    modalRef: modalRef,
    fixedRef: inputRef,
    isOpen: open,
    dropdownOffset: dropdownOffset
  })

  const filteredOptions: (string | DropdownOption)[] = useMemo(() => {
    // console.log('inside filteredoptions', name)
    if (!search) return options;
    const lowered = search.toLowerCase();

    return options.filter((opt) => {
      const label = (opt as DropdownOption).label.toLowerCase();
      return label.indexOf(lowered) !== -1;
    });
  }, [search, options]);

  const {
    highlightIndexRef,
    handleKeyDown,
    registerOption,
    reset,
  } = useDropdownNavigation(filteredOptions, close)

  useLayoutEffect(() => {
    if (open) {
      calculatePosition()
      reset()
    }
  }, [open, options.length])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearchChange?.(e.target.value)
  }


  useEffect(() => {
    if (!open) return

    const handler = (e: KeyboardEvent) => {
      // if (!e.code.includes('Arrow') && !e.code.includes('Enter')) return
      if (
        !e.code.startsWith("Arrow") &&
        e.code !== "Enter" &&
        e.code !== "Escape"
      ) return
      return handleKeyDown(e, onSelect)
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, options, onSelect])

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();

    const handler = () => calculatePosition();

    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);

    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open]);

  if (!open) return null

  return (
    <div
      ref={modalRef}
      className={`fixed z-50 bg-white border rounded-lg shadow-xl ${className}`}
      style={position}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* {console.log('the position is')} */}
      {searchable && (
        <div className="p-2 border-b">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => handleSearch(e)}
            className="w-full px-3 py-1 border rounded"
            placeholder="Search..."
          />
        </div>
      )}

      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">
            No options found
          </div>
        ) : (
          filteredOptions.map((item, index) =>
            <DropdownItem
              key={typeof item === "string" ? item : item.value}
              item={item}
              index={index}
              highlighted={highlightIndexRef.current === index}
              register={registerOption(index)}
              renderItem={renderItem}
            />
          )
        )}
      </div>
    </div>
  )
}

export default memo(BaseDropdown)