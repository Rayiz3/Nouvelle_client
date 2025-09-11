import React from "react";
import { useGreetingStore } from "../system/Greeting";
import { useMainStore } from "../system/Main";
import { IconLike } from "../components/Icons";
import QueryTextbox from "../components/QueryTextbox";

const fadeStyle = (signal: boolean) => { return `
    ${signal ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-1000 ease-in-out
`}

const MainHeader: React.FC = () => {
    const isIconVisible = useGreetingStore(state => state.isIconVisible);
    const searchingQuery = useMainStore(state => state.searchingQuery);
    const setSearchingQuery = useMainStore(state => state.setSearchingQuery);

    return (
        <div className={`
            ${fadeStyle(isIconVisible)}
            flex flex-row
            fixed top-8 right-8 z-10
        `}>
            <IconLike style="mr-4" />
            <QueryTextbox
                curQuery={searchingQuery}
                setCurQuery={setSearchingQuery}
                placeholder="Search names..." />
        </div>
    )
}

export default MainHeader