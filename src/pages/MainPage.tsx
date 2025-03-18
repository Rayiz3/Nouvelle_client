import { Component } from "solid-js";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import Greetings from "../components/Greetings";

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