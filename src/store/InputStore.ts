import { isArray } from "src/functions/dataTypesValidation"
import { isIndex } from "src/Utils/inputStoreUtils"

type Listener = () => void

const EMPTY_ARRAY: any[] = []

const EMPTY_REF: React.RefObject<HTMLDivElement | null> = {current : null}

class InputStore {
  private rawData = {} as Record<string, any>
  private state = {
    inputData: null as Record<string, any> | null,
    initialData: null as Record<string, any> | null,
    editedKeys: new Set<string>()
  }

  sharedContext = new Map<string, any>()

  dropdownSearch = new Map<string, any[]>()

  dropdownContext = new Map<string, React.RefObject<HTMLDivElement | null>>()

  getDropdownContext(key: string) {
    return this.dropdownContext.get(key) ?? EMPTY_REF
  }

  setDropdownContext(key: string, value: React.RefObject<HTMLDivElement | null>) {
    this.dropdownContext.set(key, value)
    // this.notify(key)
  }

  getDropdownSearch(key: string) {
    // if (!this.dropdownSearch.has('si')) return EMPTY_ARRAY
    return this.dropdownSearch.get(key) || EMPTY_ARRAY
  }

  setDropdownSearch(key: string, value: any[]) {
    this.dropdownSearch.set(key, value)
    this.notify(key)
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
    return this.state
  }

  initializeInputStore(mode : "edit" | "default") {
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
        this.arrayItems.set(path, [...value])
        this.notify(path)
        for (let i = 0; i < value.length; i++) {
          this.collectKeys(value[i], `${path}.${i}`, paths)
        }
      }
      else {
        if (this.listeners.has(path)) {
          this.currentValue = value
          this.notify(path) // queued because batching = true
        }
        // paths.push(path)
      }
    }
  }

  setFieldInitialData (key: string, value: any, isDisabledInput?: boolean) {
    this.setNestedValue(this.state.inputData, key, value)
    if (isDisabledInput) {
      this.setNestedValue(this.rawData, key, value)
    } else {
      this.setNestedValue(this.rawData, key, "")
    }
    if (this.isEditMode) {
      this.setNestedValue(this.state.initialData, key, value)
    }
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
      this.notify(key)
    }
    if (!this.isEditMode) return
    // const initialData = this.state.initialData
    // if (initialData![key] === undefined) this.setNestedValue(initialData, key, value)
    const initial = this.getNestedValue(this.state.initialData, key)
    if (initial === undefined) this.setNestedValue(this.state.initialData, key, value)
    if (value !== initial) this.state.editedKeys.add(key)
    else this.state.editedKeys.delete(key)
  }

  getValue(key: string) {
    return this.getNestedValue(this.state.inputData, key)
  }
  getHookValue(key: string) {
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
      this.state = {
        inputData: data,
        initialData: this.isEditMode ? structuredClone(data) : null,
        editedKeys: new Set()
      }
      this.currentValue = ""
      this.arrayItems.clear()
      this.notifyAll()
      this.sharedContext.clear()
    }
  }

  clear() {
    this.state = {
      inputData: null,
      initialData: null,
      editedKeys: new Set()
    }
    this.currentValue = ""
    this.arrayItems.clear()
    this.sharedContext.clear()
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

  private arrayItems = new Map<string, any[]>()   ////// arraycontainer and items. it has nothing to do with inputs inside arraycontainer. which means it stores supposedly playLink -> [data1, data2, data3] just to map and do not store playLink.0 or playLink.0.host

  getArrayItems(path: string) {
    const arr = this.arrayItems.get(path)
    return arr
  }

  addArrayItem(path: string, value: any) {
    const prev = this.arrayItems.get(path) ?? []

    
    const next = Array.isArray(value)
    ? [...prev, ...value]
    : [...prev, value]
    
    this.arrayItems.set(path, next)
    this.notify(path)
  }

  removeArrayItem(path: string, index: number) {
    const prev = this.arrayItems.get(path)
    if (!Array.isArray(prev)) return

    const next = prev.filter((_, i) => i !== index)
    this.arrayItems.set(path, next)

    this.notify(path)
  }
  
  //// this is to solve the problem of inputs inside arraycontainer which can change with setEditData. like if setEditData increases arrayItems from backend it will show replace and show the updated data in ui
  private hydrateArrays(obj: any, prefix = '') {
  for (const key in obj) {
    const value = obj[key]
    const path = prefix ? `${prefix}.${key}` : key

    if (Array.isArray(value)) {
      // 🔥 THIS IS THE KEY LINE
      this.arrayItems.set(path, [...value])
      this.notify(path)

      // recurse into array objects
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          this.hydrateArrays(item, `${path}.${index}`)
        }
      })
    }

    else if (typeof value === 'object' && value !== null) {
      this.hydrateArrays(value, path)
    }
  }
}

}

export const inputStore = new InputStore()



  // private notify(key: string | string[]) {
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
//     this.listeners.add(listener)
//     return () => this.listeners.delete(listener)
//   }

//   private notify() {
//     this.listeners.forEach(l => l())
//   }

//   getSnapshot = () => {
//     return this.state
//   }

//   initializeInputStore() {
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