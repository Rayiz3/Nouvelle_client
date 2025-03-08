import { Component } from "solid-js";
import { greetingSys } from "../system/Greeting";
import { IconLike, IconSearch } from "./Icons";
import { mainSys } from "../system/Main";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const MainHeader: Component = () => {
    return (
        <div class={`
            ${fadeStyle(greetingSys.isIconVisible())}
            flex flex-row
            fixed top-8 right-8
        `}>
            <IconLike style="mr-4"/>
            <div class=" flex flex-row p-1 border-b border-plain">
                <input
                    value={mainSys.searchingQuery()}
                    onChange={(e) => mainSys.setSearchingQuery(e.target.value)}
                    placeholder="Search names..."
                    class="text-xl text-plain bg-transparent mr-4 focus:outline-none"
                />
                <IconSearch style="fill-plain" />
            </div>
        </div>
    )
}

export default MainHeader