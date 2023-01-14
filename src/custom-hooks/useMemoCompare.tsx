import { useEffect, useRef, FC } from "react"

interface Props {
    next: string | any[],
    compare: () => {}
}

export const useMemoCompare: FC<Props> = (next, compare): any => {
    // Ref for storing the previous value
    const previousRef = useRef()
    const previous = previousRef.current

    // Pass the previous and next value to compare function
    // to determine whether to consider them equal
    const isEqual = compare(previous, next)

    // If not equal update previousRef to next value
    // We only update if not equal so that this hook continues to return
    // the same old value if compare keeping true
    useEffect(() => {
        if (!isEqual) {
            previousRef.current = next
        }
    })

    return isEqual ? previous : next
}