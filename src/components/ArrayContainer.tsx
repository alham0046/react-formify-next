import { type FC, memo, ReactNode, useRef, useSyncExternalStore } from "react";
import { NameScopeContext, useNameScope } from "src/context/NameScopeContext";
import { inputStore } from "src/store/InputStore";


interface ArrayHelpers {
  add: (item : any) => void
  remove: (index: number) => void
  isLast: (index: number) => boolean
}

interface ArrayContainerProps {
    name: string;
    items: any[];
    defaultAddItem?: any
    getKey?: (item: any, index: number) => string;
    children: (item: any, index: number, helpers: ArrayHelpers) => ReactNode
}
const ArrayContainer: FC<ArrayContainerProps> = ({ name, items, getKey, children, defaultAddItem }) => {
    const initialRender = useRef(true)
    const parent = useNameScope()
    const arrayScope = parent ? `${parent}.${name}` : name
    if (initialRender.current) {
        inputStore.addArrayItem(arrayScope, items)
        initialRender.current = false
    }
    const dynamicItem: any[] = useSyncExternalStore(
        (cb) => inputStore.subscribe(arrayScope, cb),
        () => {
            return inputStore.getArrayItems(arrayScope) ?? items
        }
    )

    const helpers: ArrayHelpers = {
        add: (addItem) => inputStore.addArrayItem(arrayScope, defaultAddItem || addItem),
        remove: (index) => inputStore.removeArrayItem(arrayScope, index),
        isLast: (index) => index === dynamicItem.length - 1
    }
    return (
        <>
            {
                dynamicItem.map((item, index) => {
                    const scope = `${arrayScope}.${index}`
                    const modifiedKey = getKey
                        ? getKey(item, index)
                        : scope
                    return (
                        <NameScopeContext.Provider key={modifiedKey || scope} value={scope}>
                            {children(item, index, helpers)}
                        </NameScopeContext.Provider>
                    )
                })
            }
        </>
    )
}

// ArrayContainer.Add = AddInputBox
// ArrayContainer.Remove = RemoveInputBox

export default memo(ArrayContainer)
