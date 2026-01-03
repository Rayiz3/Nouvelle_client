import React from "react";
import { ChromePicker, ColorResult } from "react-color";
import { useMyStore } from "../../system/My";

const EditColor: React.FC = () => {
    const myStore = useMyStore.getState();

    const pickcolorHandler = (color: ColorResult) => {
        myStore.setEditingColor(color.hex);
    };

    return (
        <div>
        <div className="mb-6 font-extralight text-5xl">색상</div>
        <div className="flex flex-row font-thin text-3xl">
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
        </div>
    )
}

export default EditColor;