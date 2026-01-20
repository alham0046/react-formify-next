import { inputStore } from "src/store/InputStore"

export const ResetForm = (resetData?: Record<string, any>) => {
    return inputStore.reset(resetData)
}

export const ClearForm = () => inputStore.clear()