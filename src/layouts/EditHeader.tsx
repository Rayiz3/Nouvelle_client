import React from "react";
import { useMyStore } from "../system/My";

const EditHeader: React.FC = () => {
    return (
        <div className="flex flex-row justify-between items-start">
            <div className="text-8xl">Edit</div>
            <button
                className="
                    text-4xl cursor-pointer
                    transition-transform duration-500 ease-in-out 
                    hover:scale-105"
                onClick={() => useMyStore.getState().setIsEdit(false)}>
                ✕
            </button>
        </div>
    )
}

export default EditHeader