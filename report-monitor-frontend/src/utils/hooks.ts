import { useEffect,useState,useRef } from "react";

export function useDebounce<T>(value:T,delay?:number):T {
    const [debounceValue,setDebounceValue] = useState<T>(value)


    useEffect(()=>{

        let timer = setTimeout(()=>{
            setDebounceValue(value)
        },delay||500)

        return ()=>{
            clearTimeout(timer)
        }

    },[value,delay])


    return debounceValue
}

export function useScreen(){

    const getScreen = ()=>{
        return {
            width:window.screen.width,
            height:window.screen.height
        } as Screen
    }

    const [screen,setScreen] = useState<Screen|undefined>(getScreen())

    useEffect(()=>{
        const handlerSize = ()=>{
            setScreen(getScreen())
        }

        window.addEventListener('resize',handlerSize)

        return ()=>{
            window.removeEventListener('reset',handlerSize)
        }
    },[])

    return screen
}