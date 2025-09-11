import React from "react";
import { useMyStore } from "../system/My";

interface StackCardProps {
    name: string;
    slug: string;
    color: string;
}

const StackCard: React.FC<StackCardProps> = ({name, slug, color}) => {
    return (
        <button className="
            flex flex-col items-center
            w-[88px] h-[108px] ml-1 mr-1 rounded-lg shadow-xl
            cursor-pointer transition hover:opacity-60"
            style={{"backgroundColor": `#${color}`}}
            onClick={() => useMyStore.getState().removeEditingStacks(slug)}>

            <img src={`https://cdn.simpleicons.org/${slug}/ffffff`}
                alt={name}
                className="flex-1 w-10 h-10" />
            <div className="
                flex justify-center items-center
                w-full h-[30%] bg-black rounded-b-lg overflow-clip">
                <p className="font-normal text-sm text-white">{name}</p>
            </div>
        </button>
    )
}

export default StackCard