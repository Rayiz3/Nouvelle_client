import React from "react";
import { useMyStore } from "../../system/My";

const EditLink: React.FC = () => {
    const editingLinks = useMyStore(state => state.editingLinks);
    const focusedLinkIdx = useMyStore(state => state.focusedLinkIdx);
    const myStore = useMyStore.getState();

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

    return (
        <div>
        <div className="mb-6 font-extralight text-5xl">링크</div>
        <div className="flex flex-row items-start gap-2">
            <div className="flex flex-col w-xl min-w-xl h-[184px] bg-black/25 overflow-x-auto scrollbar-hide">
                {editingLinks.map((e, idx) => (
                    <input
                        key={idx}
                        value={e}
                        onChange={e => myStore.setEditingLinksByIdx(focusedLinkIdx, e.target.value)}
                        placeholder="http..."
                        onFocus={() => myStore.setFocusedLinkIdx(idx)}
                        className={`text-xl pl-2 pr-2 pt-1 pb-1 focus:outline-none ${focusedLinkIdx === idx ? "border" : ""}`}/>
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

export default EditLink;