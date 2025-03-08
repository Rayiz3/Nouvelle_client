import { Component } from "solid-js";
import { greetingSys } from "../system/Greeting";
import { IconLogout } from "./Icons";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const MainFooter: Component = () => {
    return (
        <div class={`
            ${fadeStyle(greetingSys.isIconVisible())}
            flex flex-row justify-end
            fixed bottom-8 left-8
        `}>
            <IconLogout />
        </div>
    )
}

export default MainFooter