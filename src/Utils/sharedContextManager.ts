import { inputStore } from "src/store/InputStore";

export const SharedContext = {
    get : (key?: string) => key ? inputStore.sharedContext.get(key) : Object.fromEntries(inputStore.sharedContext),
    set : (key : string, value : any) => inputStore.sharedContext.set(key, value),
    addMany : (data : Record<string, any>) => addMany(data),
    remove : (key : string) => inputStore.sharedContext.delete(key),
    clear : () => inputStore.sharedContext.clear()
}

const addMany = (data : Record<string, any>) => {
    Object.entries(data).forEach(([k, v]) =>
      inputStore.sharedContext.set(k, v)
    )
}