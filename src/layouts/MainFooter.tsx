import React from "react";
import { useGreetingStore } from "../system/Greeting";
import { IconLogout } from "../components/Icons";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const MainFooter: React.FC = () => {
    const isIconVisible = useGreetingStore(state => state.isIconVisible);
    
    return (
        <div className={`
            ${fadeStyle(isIconVisible)}
            flex flex-row justify-end
            fixed bottom-8 left-8 z-10
        `}>
            <IconLogout />
        </div>
    )
}

export default MainFooter