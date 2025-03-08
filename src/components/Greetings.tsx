import { Component, onMount, Show } from "solid-js";
import { greetingSys } from "../system/Greeting";
import { accountSys } from "../system/Account";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const Greetings: Component = () => {
    onMount(() => {
        const timerFirst = setTimeout(() => {
            greetingSys.setIsMessageVisible("first", true)
            greetingSys.setIsMessageVisible("third", false)
        }, greetingSys.timeInterval)

        const timerSecond = setTimeout(() => {
            greetingSys.setIsMessageVisible("first", false)
            greetingSys.setIsMessageVisible("second", true)
        }, 2 * greetingSys.timeInterval)

        const timerThird = setTimeout(() => {
            greetingSys.setIsMessageVisible("second", false)
            greetingSys.setIsMessageVisible("third", true)
        }, 3 * greetingSys.timeInterval)
    })

    return (
        <div class="
            flex flex-col justify-center
            h-[100vh] font-pretendard font-thin text-center text-size-mid text-plain">
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
                        onClick={() => {
                            greetingSys.setIsIconVisible(true);
                        }}>
                        클릭해서 시작
                    </button>
                </Show>
            </div>
        </div>
    )
}

export default Greetings