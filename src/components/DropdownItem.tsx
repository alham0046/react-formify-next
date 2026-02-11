import React, { memo } from 'react'
import type { BaseDropdownProps, DropdownOption } from './BaseDropdown'

interface DropdownItemProps {
  item: string | DropdownOption
  index: number
  highlighted: boolean
  register: (el: HTMLDivElement | null) => void
  renderItem: BaseDropdownProps["renderItem"]
}

const DropdownItem : React.FC<DropdownItemProps> = ({ item, index, highlighted, register, renderItem }) => {
  return (
    <>
        {renderItem(item, index, highlighted, register)}
      </>
  )
}

export default memo(DropdownItem)
