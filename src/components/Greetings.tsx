import { Component, onCleanup, onMount, Show } from "solid-js";
import { greetingSys } from "../system/Greeting";
import { accountSys } from "../system/Account";
import HexaMap from "./HexaMap";

const fadeStyle = (signal: boolean) => { return `
    flex justify-center items-center w-[100vw] h-[100vh] absolute
    ${signal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    transition-opacity duration-1000 ease-in-out
`}

const Greetings: Component = () => {
    let timerFirst: number;
    let timerSecond: number;
    let timerThird: number;

    onMount(() => {
        timerFirst = setTimeout(() => {
            greetingSys.setIsMessageVisible("first", true)
            greetingSys.setIsMessageVisible("third", false)
        }, greetingSys.timeInterval)

        timerSecond = setTimeout(() => {
            greetingSys.setIsMessageVisible("first", false)
            greetingSys.setIsMessageVisible("second", true)
        }, 2 * greetingSys.timeInterval)

        timerThird = setTimeout(() => {
            greetingSys.setIsMessageVisible("second", false)
            greetingSys.setIsMessageVisible("third", true)
        }, 3 * greetingSys.timeInterval)
    })

    onCleanup(() => {
        clearTimeout(timerFirst);
        clearTimeout(timerSecond);
        clearTimeout(timerThird);
    })

    return (
        <div class="
            flex flex-col justify-center items-center
            w-[100vw] h-[100vh] relative
            font-pretendard font-thin text-center text-size-mid text-plain">
            <div class={fadeStyle(greetingSys.isMessageVisible.first)}>
                <Show when={
                    !greetingSys.isIconVisible() &&
                    greetingSys.isMessageVisible.first &&
                    accountSys.curUser.name}>
                    {accountSys.curUser.name}님
                </Show>
            </div>
            <div class={fadeStyle(greetingSys.isMessageVisible.second)}>
                <Show when={
                    !greetingSys.isIconVisible() &&
                    greetingSys.isMessageVisible.second &&
                    accountSys.curUser.name}>
                    안녕하세요
                </Show>
            </div>
            <div class={fadeStyle(greetingSys.isMessageVisible.third)}>
                <Show when={
                    !greetingSys.isIconVisible() &&
                    greetingSys.isMessageVisible.third &&
                    accountSys.curUser.name}>
                    <button
                        class="cursor-pointer"
                        onClick={() => {
                            greetingSys.setIsMessageVisible("third", false);
                            greetingSys.setIsIconVisible(true);
                        }}>
                        클릭해서 시작
                    </button>
                </Show>
            </div>

            <div class={fadeStyle(greetingSys.isIconVisible())}>
                <Show when={greetingSys.isIconVisible()}>
                    <HexaMap />
                </Show>
            </div>
        </div>
    )
}

export default Greetings