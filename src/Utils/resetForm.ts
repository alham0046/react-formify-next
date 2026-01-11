import { inputStore } from "src/store/InputStore"

export const ResetForm = (resetData?: Record<string, any>) => {
    return inputStore.reset(resetData)
}