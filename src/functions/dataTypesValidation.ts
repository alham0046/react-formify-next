const isEmptyObject = (obj : object) => Object.keys(obj).length === 0

const isArray = (arr : any) => Array.isArray(arr)

const isPlainObject = (obj : Record<string, any>) => typeof obj === 'object' && obj !== null && !isArray(obj);

const isEmptyArray = (arr : any[]) => arr.length === 0

const isDateType = (input : any) => !isNaN(new Date(input).getTime());

const isNumber = (str : string) => /^\d+\.?\d*$/.test(str)

export {isEmptyObject, isArray, isEmptyArray, isPlainObject, isDateType, isNumber}