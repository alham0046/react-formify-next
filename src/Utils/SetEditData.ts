import { inputStore } from "src/store/InputStore"

export const setEditData = (data : Record<string, any>) => {
    inputStore.setEditData(data)
}