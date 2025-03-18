import { Component } from "solid-js";
import { links } from "../properties/links";
import { userType } from "../system/Account";


const Hexa: Component<{isMine: boolean, user: userType}> = ({isMine, user}) => {
    return (
        <div class="relative">
            <svg id="_레이어_3" data-name="레이어 3" xmlns="http://www.w3.org/2000/svg"
                height="280"
                width="280"
                viewBox="0 0 160 160"
                class="cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
                onClick={() => {
                    window.location.href = `${links.clientAddress}/my?email=${user.email}`
                }}
            >
                <polygon class={isMine? 'fill-sub' : 'fill-plain'} points="80.2 2.41 12.83 41.3 12.83 119.09 80.2 157.99 147.57 119.09 147.57 41.3 80.2 2.41"/>
                <polygon class='fill-main' points="80.2 4.83 14.93 42.51 14.93 117.88 80.2 155.57 145.47 117.88 145.47 42.51 80.2 4.83"/>
                <polygon class={isMine? 'fill-sub' : 'fill-plain'} points="80.2 7.85 17.54 44.02 17.54 116.37 80.2 152.54 142.85 116.37 142.85 44.02 80.2 7.85"/>
            </svg>

            <div class="absolute top-1/2 left-1/2 font-pretendard text-black text-center transform -translate-x-1/2 -translate-y-1/2">
                <div class="font-bold text-sm">{user.name}</div>
                <div class="font-thin text-xs">{user.email}</div>
            </div>
        </div>
    )
}

export default Hexa