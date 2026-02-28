import { useMemo } from "react"
import { useContainerContext } from "src/context/ContainerContext"
import { InputStyle } from "src/typeDeclaration/stylesProps"
import { resolveTwStyles } from "src/Utils/resolveTwStyles"

export const useStyles = (style:any, twStyle:any) => {
    const {sharedStyles, sharedTw} = useContainerContext()

    const resolvedStyle: Partial<InputStyle> = useMemo(() => {
        if (!style) return sharedStyles
        return {
            ...sharedStyles,
            ...style, // 👈 highest priority
        }
    },[sharedStyles, style])

    const tw = useMemo(() => {
        if (!twStyle) return sharedTw
        return (resolveTwStyles({
            defaultStyles: sharedTw,
            localStyles: twStyle, // from props
        }))
    }, [ sharedTw, twStyle])

    return {
        resolvedStyle,
        tw
    }
}