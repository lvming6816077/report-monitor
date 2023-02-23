import { useEffect, useState, useRef } from 'react'
/**
 * 
 * @param value 原始响应式变量
 * @param delay 延迟时间
 * @returns 节流变量
 */
export function useDebounce<T>(value: T, delay?: number): T {
    const [debounceValue, setDebounceValue] = useState<T>(value)

    useEffect(() => {
        let timer = setTimeout(() => {
            setDebounceValue(value)
        }, delay || 500) // 默认500ms

        return () => { // 销毁时，清除setTimeout
            clearTimeout(timer)
        }
    }, [value, delay])

    return debounceValue
}

export function useThrottle<T>(value: T, delay?: number): T {
    const [debounceValue, setDebounceValue] = useState<T>(value)

    let last = useRef<number>(0)

    useEffect(() => {
        if (Date.now() - last.current > (delay || 0)) {
            last.current = Date.now()
            setDebounceValue(value)
        }
    }, [value, delay])

    return debounceValue
}

export function useScreen() {
    const getScreen = () => {
        return {
            width: window.screen.width,
            height: window.screen.height,
        } as Screen
    }

    const [screen, setScreen] = useState<Screen | undefined>(getScreen())

    useEffect(() => {
        const handlerSize = () => {
            setScreen(getScreen())
        }

        window.addEventListener('resize', handlerSize)

        return () => {
            window.removeEventListener('reset', handlerSize)
        }
    }, [])

    return screen
}

export function useScroll() {
    const [value, setValue] = useState<number>(0)

    useEffect(() => {
        const handler = () => {
            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop
            // console.log(e.target)

            setValue(scrollTop)
        }

        window.addEventListener('scroll', handler)
        return () => {
            window.removeEventListener('scroll', handler)
        }
    }, [])

    return useThrottle(value, 100)
}


// 自定义一个初始不更新的hook
export function useUpdateEffect(fn: React.EffectCallback, inputs?: React.DependencyList) {
    const didMountRef = useRef(false);
    useEffect(() => {
      if (didMountRef.current) fn();
      else didMountRef.current = true;
    }, inputs);
};
 
 
