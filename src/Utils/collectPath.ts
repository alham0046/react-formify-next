export const collectPaths =(
  obj: Record<string, any>,
  prefix = "",
  paths: string[] = []
) => {
  for (const key in obj) {
    const value = obj[key]
    const path = prefix ? `${prefix}.${key}` : key

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      collectPaths(value, path, paths)
    } else {
      paths.push(path)
    }
  }
  return paths
}
