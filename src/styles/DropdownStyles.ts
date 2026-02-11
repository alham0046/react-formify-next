import { DropdownStyleProp, InputStyle } from "src/typeDeclaration/stylesProps";

export const DEFAULT_DROPDOWN_STYLE: InputStyle & Pick<DropdownStyleProp, 'dropdownOffset'> = {
  borderWidth: '2px',
  boxHeight: '8px',
  boxWidth: '100%',
  placeHolderOffset: '16px',
  dropdownOffset: 5,
}