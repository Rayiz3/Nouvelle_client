import { Component, JSXElement } from "solid-js";
import { accountSys, signFormType } from "../system/Account";

const InputTextbox: Component<{
    inputType: string,
    storingData: keyof signFormType,
    children: JSXElement
}> = ({inputType, storingData, children}) => {
    return (
        <div>
            <label class="block text-plain text-xl ">
                {children}
            </label>
            <input type={inputType}
                   value={accountSys.signFormData[storingData]}
                   oninput={(e) => accountSys.setSignFormData(storingData, e.currentTarget.value)}
                   class="bg-transparent w-full h-16 text-plain text-2xl p-2 border-plain border-b focus:outline-none" />
        </div>
    )
}

export default InputTextbox