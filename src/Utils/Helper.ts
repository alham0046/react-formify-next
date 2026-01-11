export const isIndex = (key: string) => {
  return key !== "" && !isNaN(Number(key))
}