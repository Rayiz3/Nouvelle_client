import React from "react";
import { useAccountStore, userType } from "../system/Account";
import { links } from "../properties/links";

const Hexa: React.FC<{isMine: boolean, user: userType}> = ({isMine, user}) => {
    return (
        <div className="relative">
            <svg id="ic_hexa" data-name="ic_hexa" xmlns="http://www.w3.org/2000/svg"
                height="280"
                width="280"
                viewBox="0 0 160 160"
                className="cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
                onClick={() => {
                    localStorage.setItem("curUser", JSON.stringify(useAccountStore.getState().curUser));
                    window.location.href = `${links.clientAddress}/my?id=${user._id}`
                }}
            >
                <path className={isMine? 'fill-sub' : 'fill-plain'} d="M80.19,2.41L12.82,41.3v77.79l67.37,38.9,67.37-38.9V41.3L80.19,2.41ZM145.46,117.88l-65.27,37.69L14.92,117.88V42.51L80.19,4.83l65.27,37.69v75.37Z"/>
                <polygon className={isMine? 'fill-sub' : 'fill-plain'} points="80.19 80.2 142.85 116.37 142.85 44.02 80.19 7.85 80.19 80.2"/>
                <polygon className={isMine? 'fill-[#ebbb7d]' : 'fill-[#ccc]'} points="80.19 152.54 142.85 116.37 80.19 80.2 17.54 116.37 80.19 152.54"/>
                <polygon className={isMine? 'fill-[#ffcc87]' : 'fill-[#e6e6e6]'} points="80.19 80.2 80.19 7.85 17.54 44.02 17.54 116.37 80.19 80.2"/>
            </svg>

            <div className="absolute top-1/2 left-1/2 font-pretendard text-black text-center transform -translate-x-1/2 -translate-y-1/2">
                <div className="font-bold text-lg">{user.name}</div>
                <div className="font-thin text-sm">{user.email}</div>
            </div>
        </div>
    )
}

export default Hexa;