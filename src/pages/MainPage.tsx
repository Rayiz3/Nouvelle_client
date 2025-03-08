import { Component } from "solid-js";
import { greetingSys } from "../system/Greeting";
import { IconLike, IconLogout, IconSearch } from "../components/Icons";
import { mainSys } from "../system/Main";
import SearchBox from "../components/MainHeader";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import Greetings from "../components/Greetings";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const MainPage: Component = () => {
    return (
        <div class="
            w-[100vw] h-[100vh]
            flex items-center justify-center
            bg-main font-thin overflow-clip
        ">
            <MainHeader />
            <Greetings />
            <MainFooter />
        </div>
    )
}

export default MainPage