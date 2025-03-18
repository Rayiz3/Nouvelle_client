import { Component, Show } from "solid-js";
import Hexa from "./Hexa";
import { accountSys } from "../system/Account";


const HexaGrid: Component = () => {
    return (
        <div class="flex justify-center items-center relative w-full h-full">
            <div class="flex justify-center items-center absolute">
                <Show when={accountSys.curUser.email !== ""} fallback={
                    <p class="font-pretendard font-thin">정보 없음</p>
                }>
                    <Hexa isMine={true} user={accountSys.curUser} />
                </Show>
            </div>


        </div>
    )
}

export default HexaGrid