import { inputStore } from "src/store/InputStore";

export const handleInitialValue = (path: string, initialValue: string, compName?: string) => {
    const existingValue = inputStore.getInputNestedValue(path)
    const value = existingValue || initialValue
    inputStore.setFieldInitialData(path, value)
}