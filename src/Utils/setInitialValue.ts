import { inputStore } from "src/store/InputStore";

export const handleInitialValue = (name: string, initialValue: string, compName?: string) => {
    const storedData = inputStore.getSnapshot().inputData;
    if (!storedData) {
        return;
    }
    const value = storedData[name] || initialValue
    inputStore.setFieldInitialData(name, value)
}