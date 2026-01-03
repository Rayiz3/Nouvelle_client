import React, { useEffect } from "react";
import { useMyStore } from "../../system/My";
import QueryTextbox from "../QueryTextbox";
import StackCard from "../StackCard";
import * as simpleIcons from 'simple-icons';

const EditStack: React.FC = () => {
    const stackQuery = useMyStore(state => state.stackQuery);
    const filteredQueries = useMyStore(state => state.filteredQueries);
    const editingStacks = useMyStore(state => state.editingStacks);
    const myStore = useMyStore.getState();

    const listStack = Object.values(simpleIcons) as simpleIcons.SimpleIcon[];

    const selectFilteredQueryHandler = (title: string) => {
        myStore.setStackQuery("");
        myStore.addEditingStacks(title);
    }

    const getStackBySlug = (slug: string) => {
        const stack = listStack.filter(e => e.slug === slug)[0];
        return {title: stack.title, hex: stack.hex};
    }

    useEffect(() => {
        const filteredStacks = stackQuery.length > 0? listStack.filter(e => e.slug.toLowerCase().includes(stackQuery.toLowerCase())) : [];

        myStore.setFilteredQueries(filteredStacks.map(e => e.slug));
    }, [stackQuery]);

    return (
        <div>
        <div className="mb-6 font-extralight text-5xl">기술 스택</div>
        <QueryTextbox
            curQuery={stackQuery}
            setCurQuery={myStore.setStackQuery}
            placeholder="브랜드 검색..." />
        <div className="flex flex-row items-center h-[142px] mt-2 font-pretendard font-thin">
            <div className="w-3xs min-w-3xs h-full pl-1 pr-1 bg-black/25 text-3xl overflow-auto scrollbar-hide">
                {filteredQueries.map(e => (
                    <div className="p-1 text-lg border-b border-b-gray-500 cursor-pointer transition hover:opacity-70 focus:opacity-50"
                        key={e}
                        onClick={() => selectFilteredQueryHandler(e)}>{e}</div>
                ))}
            </div>
            <div className="ml-8 mr-8 font-pretnedard text-2xl">{editingStacks.length}/6</div>
            {editingStacks.map(e => (
                <StackCard key={e} name={getStackBySlug(e).title} slug={e} color={getStackBySlug(e).hex} />
            ))}
        </div>
        </div>
    )
}

export default EditStack;