import { createContext, useContext } from "react"

type LabelMode = boolean
// type LabelMode = "floating" | "row"

interface FormLayoutContextValue {
  labelMode: LabelMode
}

export const FormLayoutContext = createContext<FormLayoutContextValue>({labelMode : false})

export const useFormLayout = () => useContext(FormLayoutContext)
