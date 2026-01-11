import { inputStore } from "src/store/InputStore";

export interface FieldProps {
    [key: string]: any;
}
export const setFieldValue = (FieldCredentials: FieldProps) => {
    const keys = Object.keys(FieldCredentials);
    for (const key of keys) {
        inputStore.setValue(key, FieldCredentials[key])
    }
}