import { Component } from "solid-js";
import { greetingSys } from "../system/Greeting";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const MainPage: Component = () => {
    return (
        <div class={`
            w-[100vw] h-[100vh]
            flex items-center justify-center
            bg-main
            font-thin
            overflow-clip
        `}>
            <div class={`
                ${fadeStyle(greetingSys.isIconVisible())}
                flex flex-row
                fixed top-0 right-0
            `}>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default MainPage