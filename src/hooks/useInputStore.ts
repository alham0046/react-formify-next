import { useEffect, useRef, useSyncExternalStore } from 'react'
import { inputStore } from 'src/store/InputStore';

export function useInputStore(key: string) {
  const valueRef = useRef("")
  const initialRender = useRef(true)
  useEffect(() => {
    setTimeout(() => {
      initialRender.current = false
    }, 200);
  }, [])
  return useSyncExternalStore(
    (listener) => inputStore.subscribe(key, listener),
    () => {
      if (initialRender.current) {
        if (valueRef.current === inputStore.getInputNestedValue(key)) return valueRef.current
      }
      if (valueRef.current === inputStore.currentValue) return valueRef.current
      const value = inputStore.getHookValue(key)
      valueRef.current = value
      return value
    }
  )
}
