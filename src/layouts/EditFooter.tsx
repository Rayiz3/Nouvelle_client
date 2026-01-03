import React from "react";
import { useMyStore } from "../system/My";
import { useRequestStore } from "../system/Request";
import { useAccountStore } from "../system/Account";

const EditFooter: React.FC = () => {
    const clickHandler = () => {
        const myStore = useMyStore.getState();
        const requestStore = useRequestStore.getState();
        const accountStore = useAccountStore.getState();

        const newConfig = {
            color: myStore.editingColor,
            stacks: myStore.editingStacks,
            links: myStore.editingLinks,
            iconMeshUrl: myStore.editingIconMeshUrl,
        }
        console.log("newConfig:", newConfig);
        myStore.setConfig(newConfig);
        
        requestStore.setUserConfigById(accountStore.curUser._id, newConfig)
            .then((res) => console.log("db stored", res?.config))
            .then(() => myStore.setIsEdit(false));
    }

    return (
        <div className="flex flex-row justify-end">
            <button
                className="
                    w-[160px] h-[80px]
                    border border-sub text-sub text-4xl cursor-pointer
                    transition-transform duration-500 ease-in-out hover:bg-[rgba(255,255,255,0.05)]"
                onClick={() => clickHandler()}>
                Apply
            </button>
        </div>
    )
}

export default EditFooter