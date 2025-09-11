import React, { useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { useMyStore } from "../system/My";
import QueryTextbox from "../components/QueryTextbox";
import StackCard from "../components/StackCard";
import * as simpleIcons from 'simple-icons';

const EditBody: React.FC = () => {
    const stackQuery = useMyStore(state => state.stackQuery);
    const filteredQueries = useMyStore(state => state.filteredQueries);
    const editingStacks = useMyStore(state => state.editingStacks);
    const editingLinks = useMyStore(state => state.editingLinks);
    const focusedLinkIdx = useMyStore(state => state.focusedLinkIdx);
    const myStore = useMyStore.getState();

    const listStack = Object.values(simpleIcons) as simpleIcons.SimpleIcon[];

    const pickcolorHandler = (color: ColorResult) => {
        myStore.setEditingColor(color.hex);
    };

    const selectFilteredQueryHandler = (title: string) => {
        myStore.setStackQuery("");
        myStore.addEditingStacks(title);
    }

    const getStackBySlug = (slug: string) => {
        const stack = listStack.filter(e => e.slug === slug)[0];
        return {title: stack.title, hex: stack.hex};
    }

    const addLinkHandler = () => {
        if (myStore.editingLinks.length >= myStore.maxLinkIdx) return
        
        myStore.addEditingLinks("");
        myStore.setFocusedLinkIdx(myStore.editingLinks.length)
    }

    const removeLinkHandler = () => {
        if (myStore.focusedLinkIdx < 0) return
        
        myStore.removeEditingLinks(myStore.focusedLinkIdx);
        myStore.setFocusedLinkIdx(myStore.focusedLinkIdx - 1);
    }

    useEffect(() => {
        const filteredStacks = stackQuery.length > 0? listStack.filter(e => e.slug.toLowerCase().includes(stackQuery.toLowerCase())) : [];

        myStore.setFilteredQueries(filteredStacks.map(e => e.slug));
    }, [stackQuery]);

    return (
        <div className="flex-1 flex-col items-start mt-8 mb-8 overflow-auto scrollbar-hide">

            <div className="mb-4 font-normal text-4xl">색상</div>
            <div className="flex flex-row font-pretendard font-thin text-3xl">
                <ChromePicker
                    color={useMyStore().editingColor}
                    onChangeComplete={pickcolorHandler}
                    disableAlpha={true}
                />
                <div className="flex flex-col justify-evenly items-center w-xs">
                    <div>{useMyStore().editingColor}</div>
                    <div
                        className="w-36 h-12 shadow-xl"
                        style={{ backgroundColor: useMyStore().editingColor }}/>
                </div>
            </div>

            <div className="mt-8 mb-4 font-normal text-4xl">기술 스택</div>
            <QueryTextbox
                curQuery={stackQuery}
                setCurQuery={myStore.setStackQuery}
                placeholder="브랜드 검색..." />
            <div className="flex flex-row items-center h-[142px] mt-2 font-pretendard font-thin">
                <div className="w-3xs h-full pl-1 pr-1 bg-black/25 text-3xl overflow-auto scrollbar-hide">
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

            <div className="mt-8 mb-4 font-normal text-4xl">링크</div>
            <div className="flex flex-row items-start gap-2">
                <div className="flex flex-col w-xl h-[184px] bg-black/25 overflow-x-auto scrollbar-hide">
                    {editingLinks.map((e, idx) => (
                        <input
                            key={idx}
                            value={e}
                            onChange={e => myStore.setEditingLinksByIdx(focusedLinkIdx, e.target.value)}
                            placeholder="http..."
                            onFocus={() => myStore.setFocusedLinkIdx(idx)}
                            className={`font-pretendard text-xl pl-2 pr-2 pt-1 pb-1 focus:outline-none ${focusedLinkIdx === idx ? "border" : ""}`}/>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <button className="w-[24px] aspect-[1/2] font-bold text-xl bg-black/25 cursor-pointer transition hover:opacity-70"
                        onClick={addLinkHandler}>
                        +
                    </button>
                    <button className="w-[24px] aspect-[1/2] font-bold text-xl bg-black/25 cursor-pointer transition hover:opacity-70"
                        onClick={removeLinkHandler}>
                        -
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditBody