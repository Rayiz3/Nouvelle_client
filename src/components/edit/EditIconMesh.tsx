import React, { useRef } from "react";
import { useMyStore } from "../../system/My";
import { useRequestStore } from "../../system/Request";
import { useAccountStore } from "../../system/Account";
import Preview from "./Preview";

const EditIconMeshUrl: React.FC = () => {
    const iconMeshUrlRef = useRef<HTMLCanvasElement>(null);

    const prompt = useMyStore(state => state.prompt);
    const isGenerating = useMyStore(state => state.isGenerating);
    const myStore = useMyStore.getState();
    const requestStore = useRequestStore.getState();
    const accountStore = useAccountStore.getState();

    const generateHandler = () => {
        myStore.setIsGenerating(true);
        myStore.setEditingIconMeshUrl("");
        requestStore.addIconMeshUrlById(accountStore.curUser._id, prompt)
            .then(res => myStore.setEditingIconMeshUrl(res || ""))
            .then(() => myStore.setIsGenerating(false));
    }

    const resetHandler = () => {
        myStore.setPrompt("");
    }

    const previewStyle = "flex justify-center items-center w-full h-full p-2"

    return (
        <div>
        <div className="mb-6 font-extralight text-5xl">사용자 지정 아이콘</div>
        <p className="mb-2 text-xl">텍스트로 원하는 모양의 아이콘 피규어를 생성할 수 있습니다.</p>
        <div className="flex flex-row items-start gap-4">
            <div className="flex flex-col gap-3 w-xl min-w-xl">
                <textarea
                    value={prompt}
                    onChange={e => myStore.setPrompt(e.target.value)}
                    placeholder="여기에 프롬프트 입력..."
                    className="w-full h-[184px] p-2 text-xl bg-black/25 focus:outline-none resize-none" />
                <div className="flex flex-row justify-between gap-3 w-full h-[36px] text-black font-normal text-lg">
                    <button 
                        onClick={() => generateHandler()}
                        disabled={isGenerating}
                        className="flex-1 bg-sub disabled:cursor-not-allowed disabled:opacity-50 enabled:cursor-pointer enabled:hover:opacity-80 transition-colors">
                        생성 
                    </button>
                    <button
                        onClick={() => resetHandler()}
                        className="flex-1 bg-plain cursor-pointer hover:opacity-80 transition-colors">
                        초기화
                    </button>
                </div>
            </div>
            <div className="aspect-square h-[231px] bg-black/25">
                {(isGenerating)
                    ? <div className={previewStyle}> generating... </div>
                    : <><canvas id="icon-mesh" ref={iconMeshUrlRef} className={previewStyle} /><Preview /></>
                }
            </div>
        </div>
        </div>
    )
}

export default EditIconMeshUrl;