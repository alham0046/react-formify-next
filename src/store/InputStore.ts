import { isArray } from "src/functions/dataTypesValidation"
import { isIndex } from "src/Utils/inputStoreUtils"

type Listener = () => void

class InputStore {
  private rawData = {} as Record<string, any>
  private state = {
    inputData: null as Record<string, any> | null,
    initialData: null as Record<string, any> | null,
    editedKeys: new Set<string>()
  }

  private isBatching = false
  private pendingKeys = new Set<string>()


  currentValue = ""

  private _isEditMode = false;

  set isEditMode(value: boolean) {
    if (this._isEditMode !== value) {
      this._isEditMode = value;
      
      // // RUN YOUR METHOD HERE
      this.state.initialData = {}
    }
  }

  get isEditMode() {
    return this._isEditMode
  }
  
  backgroundColor = 'white'

  private listeners = new Map<string, Set<Listener>>()     /////// can fix this. can do new Map<string, Listener>() instead.

  subscribe(key: string, listener: Listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }

    this.listeners.get(key)!.add(listener)

    return () => {
      this.listeners.get(key)?.delete(listener)
    }
  }

  private notify(key: string | string[]) {
    if (isArray(key)) {
      key.forEach(k => this.notify(k))
      return
    }

    if (this.isBatching) {
      this.pendingKeys.add(key)
      return
    }

    this.listeners.get(key)?.forEach(l => l())
  }

  private notifyAll() {
    this.listeners.forEach(i => i.forEach(l => l()))
  }

  batch(fn: () => void) {
  this.isBatching = true
  fn()
  this.isBatching = false

  this.pendingKeys.forEach(k => {
    this.listeners.get(k)?.forEach(l => l())
  })
  this.pendingKeys.clear()
}



  getSnapshot = () => {
    // console.log("getting input store snapshot")
    return this.state
  }

  initializeInputStore(mode : "edit" | "default") {
    // console.log("initializing input store")
    this.state.inputData = {}
    if (mode === "edit") this.isEditMode = true
  }

  setBackgroundColor(color: string) {
    this.backgroundColor = color
  }

  setEditData(data: Record<string, any>) {
    if (!this.isEditMode) return
    // const keys = Object.keys(data)
    
    // const paths = collectPaths(data)
    this.batch(() => {
      this.state = {
        inputData: structuredClone(data),
        initialData: structuredClone(data),
        editedKeys: new Set()
      }
      this.collectKeys(data)
    })
  }

  private collectKeys(
    obj: Record<string, any>,
    prefix = "",
    paths: string[] = []
  ) {
    for (const key in obj) {
      const value = obj[key]
      const path = prefix ? `${prefix}.${key}` : key
      
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.collectKeys(value, path, paths)
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          this.collectKeys(value[i], `${path}.${i}`, paths)
        }
      }
      else {
        if (this.listeners.has(path)) {
          // console.log('the path is', path)
          this.currentValue = value
          this.notify(path) // queued because batching = true
        }
        // paths.push(path)
      }
    }
  }

  setFieldInitialData (key: string, value: any) {
    this.setNestedValue(this.state.inputData, key, value)
    this.setNestedValue(this.rawData, key, "")
    if (this.isEditMode) {
      this.setNestedValue(this.state.initialData, key, value)
    }
    // console.log("setting initial value", key, value)
    this.currentValue = value
    this.notify(key)
  }

  setValue(key: string, value: any) {
    const inputData = this.state.inputData
    if (!inputData) return
    this.currentValue = value
    const prev = this.getNestedValue(inputData, key)
    this.setNestedValue(inputData, key, value)
    if (prev !== value) {
      console.log("triggering setvalue", value, prev, this.isEditMode)
      this.notify(key)
    }
    if (!this.isEditMode) return
    // const initialData = this.state.initialData
    // if (initialData![key] === undefined) this.setNestedValue(initialData, key, value)
    const initial = this.getNestedValue(this.state.initialData, key)
    if (initial === undefined) this.setNestedValue(this.state.initialData, key, value)
    console.log("checking setvalue initial value", initial, value, key)
    if (value !== initial) this.state.editedKeys.add(key)
    else this.state.editedKeys.delete(key)
  }

  getValue(key: string) {
    // console.log("getting input store value", key, this.listeners)
    return this.getNestedValue(this.state.inputData, key)
  }
  getHookValue(key: string) {
    // console.log("getting input store value", key, this.state)
    const hookValue = this.getNestedValue(this.state.inputData, key)
    return hookValue
  }

  reset(nextData?: Record<string, any>) {
    return (key?: string | string[]) => {
      if (key) {
        if (typeof key === "string") {
          this.setValue(key, "")
          return
        }
        if (isArray(key)) {
          key.forEach(k => this.setValue(k, ""))
          return
        }
      }
      const data = structuredClone(nextData ?? this.rawData ?? {})
      // console.log(data)
      this.state = {
      inputData: data,
      initialData: this.isEditMode ? structuredClone(data) : null,
      editedKeys: new Set()
    }
    this.currentValue = ""
    this.arrayItems.clear()
    this.notifyAll()
    }
  }

  private setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.')
    let curr = obj

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const nextKey = keys[i + 1]

      // Decide container type for current key
      if (isIndex(key)) {
        const index = Number(key)
        if (!Array.isArray(curr)) {
          throw new Error(`Expected array at ${keys.slice(0, i).join('.')}`)
        }
        curr[index] ??= isIndex(nextKey) ? [] : {}
        curr = curr[index]
      } else {
        curr[key] ??= isIndex(nextKey) ? [] : {}
        curr = curr[key]
      }
    }

    const lastKey = keys.at(-1)!

    if (isIndex(lastKey)) {
      if (!Array.isArray(curr)) {
        throw new Error(`Expected array at ${keys.slice(0, -1).join('.')}`)
      }
      curr[Number(lastKey)] = value
    } else {
      curr[lastKey] = value
    }
  }

  private getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((curr, key) => {
      if (curr == null) return undefined
      return isIndex(key) ? curr[Number(key)] : curr[key]
    }, obj)
  }

  getInputNestedValue(path: string) {
    return this.getNestedValue(this.state.inputData, path)
  }

  private arrayItems = new Map<string, any[]>()   ////// path -> array items

  getArrayItems(path: string) {
    const arr = this.arrayItems.get(path)
    // console.log("getting array items", path, arr)
    return arr
  }

  addArrayItem(path: string, value: any) {
    const prev = this.arrayItems.get(path) ?? []

    
    const next = Array.isArray(value)
    ? [...prev, ...value]
    : [...prev, value]
    
    this.arrayItems.set(path, next)
    console.log("adding array item", path, this.arrayItems)
    this.notify(path)
  }

  removeArrayItem(path: string, index: number) {
    const prev = this.arrayItems.get(path)
    if (!Array.isArray(prev)) return

    const next = prev.filter((_, i) => i !== index)
    this.arrayItems.set(path, next)

    this.notify(path)
  }
}

export const inputStore = new InputStore()



  // private notify(key: string | string[]) {
  //   console.log("notifying input store", key)
  //   if (isArray(key)) return key.forEach(k => this.notify(k))
  //   this.listeners.get(key)?.forEach(l => l())
  // }


      // for (const key of paths) {
      //   // inputStore.setValue(key, data[key])
      //   if (this.listeners.has(key)) {
      //     this.currentValue = data[key]
      //     this.notify(key) // queued because batching = true
      //   }
      // }


  // private setNestedValue(obj: any, path: string, value: any) {
  //   const keys = path.split('.')
  //   let curr = obj
  //   for (let i = 0; i < keys.length - 1; i++) {
  //     curr[keys[i]] ??= {}
  //     curr = curr[keys[i]]
  //   }
  //   curr[keys.at(-1)!] = value
  // }




// private getNestedValue(obj: any, path: string) {
//   // console.log("getting input store path", path)
//   return path.split('.').reduce((a, c) => a?.[c], obj)
// }



/////////   above code allows to set the value only if user uses InputContainer. and also reuse of this.state.inputData is ensured
// setValue(key: string, value: any) {
//     const prev = this.getValue(key)
//     this.setNestedValue(this.state.inputData, key, value)
//     if (prev !== value) {
//       this.notify(key)
//     }
//     const initialData = this.state.initialData
//     if (!initialData) return
//     const initial = this.getNestedValue(initialData, key)
//     if (value !== initial) this.state.editedKeys.add(key)
//     else this.state.editedKeys.delete(key)
//   }




// type Listener = () => void

// class InputStore {
//   private state = {
//     inputData: null as Record<string, any> | null,
//     initialData: null as Record<string, any> | null,
//     editedKeys: new Set<string>()
//   }
  
//   backgroundColor = 'white'

//   private listeners = new Set<Listener>()

//   subscribe = (listener: Listener) => {
//     console.log("subscribing to input store")
//     this.listeners.add(listener)
//     return () => this.listeners.delete(listener)
//   }

//   private notify() {
//     this.listeners.forEach(l => l())
//   }

//   getSnapshot = () => {
//     console.log("getting input store snapshot")
//     return this.state
//   }

//   initializeInputStore() {
//     console.log("initializing input store")
//     this.state.inputData = {}
//   }

//   setInitialData(data: Record<string, any>) {
//     this.state = {
//       inputData: structuredClone(data),
//       initialData: structuredClone(data),
//       editedKeys: new Set()
//     }
//     this.notify()
//   }

//   setBackgroundColor(color: string) {
//     this.backgroundColor = color
//   }

//   setValue(key: string, value: any) {
//     const prev = this.getValue(key)
//     this.setNestedValue(this.state.inputData, key, value)

//     const initial = this.getNestedValue(this.state.initialData, key)
//     if (value !== initial) this.state.editedKeys.add(key)
//     else this.state.editedKeys.delete(key)

//     if (prev !== value) this.notify()
//   }

//   getValue(key: string) {
//     return this.getNestedValue(this.state.inputData, key)
//   }

//   reset() {
//     this.state = {
//       inputData: {},
//       initialData: {},
//       editedKeys: new Set()
//     }
//     this.notify()
//   }

//   private setNestedValue(obj: any, path: string, value: any) {
//     const keys = path.split('.')
//     let curr = obj
//     for (let i = 0; i < keys.length - 1; i++) {
//       curr[keys[i]] ??= {}
//       curr = curr[keys[i]]
//     }
//     curr[keys.at(-1)!] = value
//   }

//   private getNestedValue(obj: any, path: string) {
//     return path.split('.').reduce((a, c) => a?.[c], obj)
//   }
// }

// export const inputStore = new InputStore()