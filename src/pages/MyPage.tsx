import React, { MouseEvent, useEffect, useRef } from "react";
import { useAccountStore } from "../system/Account";
import { useRequestStore } from "../system/Request";
import { useMyStore } from "../system/My";
import { IconEdit, IconFocus, IconHome } from "../components/Icons";
import Room from "../components/three/Room";
import EditHeader from "../layouts/EditHeader";
import EditFooter from "../layouts/EditFooter";
import EditBody from "../layouts/EditBody";

const MyPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const isLoading = useMyStore(state => state.isLoading);
    const isGameMode = useMyStore(state => state.isGameMode);
    const isEdit = useMyStore(state => state.isEdit);
    const config = useMyStore(state => state.config);

    const curUser = useAccountStore(state => state.curUser);

    const myStore = useMyStore.getState();
    const accountStore = useAccountStore.getState();
    const requestStore = useRequestStore.getState();

    useEffect(() => {
        // get currently logged in user
        const savedUser = localStorage.getItem("curUser");
        if(savedUser) {
            accountStore.setCurUser(JSON.parse(savedUser));
        }

        // get visited user
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('id') || "";
        
        requestStore.getUserById(pageId)
            .then((res) => res && myStore.setConfig(res.config))
            .then(() => myStore.setIsLoading(false));
    }, [])

    const goBackHandler = () => {
        localStorage.setItem("curUser", JSON.stringify(useAccountStore.getState().curUser));
        window.window.location.href = `/main`
    }

    const editHandler = (e: MouseEvent) => {
        e.stopPropagation(); // prevent the event to propagate to the window
        const state = useMyStore.getState();
        const loadedConfig = state.config;

        state.setEditingColor(loadedConfig.color);
        state.setEditingStacks(loadedConfig.stacks);
        state.setEditingLinks(loadedConfig.links);
        state.setStackQuery("");
        state.setIsEdit(true);
    }

    return (
        <div className="relative w-[100vw] h-[100vh]">
            {isEdit && (
                <div className="
                    flex flex-col justify-center
                    absolute top-0 left-0 z-10 w-full h-full p-8
                    bg-main/90 font-gothic font-thin text-plain">
                    <EditHeader />
                    <EditBody />
                    <EditFooter />
                </div>
            )}
            <div className="
                absolute top-8 right-8 z-5
                cursor-pointer
                transition-transform duration-500 ease-in-out hover:scale-105"
                onClick={() => goBackHandler()}>
                {!isGameMode && <IconHome />}
            </div>
            {curUser._id === new URLSearchParams(window.location.search).get('id') &&
            <div className="
                absolute top-8 right-24 z-5
                cursor-pointer
                transition-transform duration-500 ease-in-out hover:scale-105"
                onClick={(e) => editHandler(e)}>
                {!isGameMode && <IconEdit />}
            </div>}
            <canvas id="room" ref={canvasRef} className="absolute left-0 top-0 z-0"></canvas>
            {(!isLoading && config)
                ? <>
                {isGameMode && <IconFocus />}
                <Room />
                </>
                : <div className="flex justify-center items-center w-full h-full fill-main">
                    Loading...
                  </div>
            }
        </div>
    )
}

export default MyPage;