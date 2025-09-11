import { create } from "zustand";
import { userType } from "./Account";
import type { MouseEvent, WheelEvent } from "react";

export interface Vector2 {
    x: number;
    y: number;
}

interface MainProps {
    isFilterOn: boolean
    setIsFilterOn: (v: boolean) => void

    isPanning: boolean
    setIsPanning: (v: boolean) => void

    searchingQuery: string
    setSearchingQuery: (v: string) => void

    scale: number
    setScale: (v: number) => void

    startPosition: Vector2
    setStartPosition: (v: Vector2) => void

    curPosition: Vector2
    setCurPosition: (v: Vector2) => void

    users: userType[]
    setUsers: (v: userType[]) => void

    hexPositions: Vector2[]
    setHexPosition: (v: Vector2[]) => void

    wheelHandler: (e: WheelEvent<HTMLDivElement>) => void
    mouseDownHandler: (e: MouseEvent<HTMLDivElement>) => void
    mouseMoveHandler: (e:MouseEvent<HTMLDivElement>) => void
    mouseUpHandler: () => void
}

export const useMainStore = create<MainProps>((set, get) => ({
    isFilterOn: false,
    setIsFilterOn: (v) => set({isFilterOn: v}),
    isPanning: false,
    setIsPanning: (v) => set({isPanning: v}),
    searchingQuery: "",
    setSearchingQuery: (v) => set({searchingQuery: v}),
    scale: 1,
    setScale: (v) => set({scale: v}),
    startPosition: {x: 0, y: 0},
    setStartPosition: (v) => set({startPosition: v}),
    curPosition: {x: 0, y: 0},
    setCurPosition: (v) => set({curPosition: v}),
    users: [],
    setUsers: (v) => set({users: v}),
    hexPositions: [],
    setHexPosition: (v) => set({hexPositions: v}),

    wheelHandler: (e: WheelEvent) => {
        const delta = e.deltaY > 0? -0.1 : 0.1;
        set({scale: Math.min(Math.max(get().scale + delta, 0.5), 3)});
    },

    mouseDownHandler: (e: MouseEvent) => {
        set({isPanning: true});
        set({startPosition: {x: e.clientX, y: e.clientY}});
    },

    mouseMoveHandler: (e: MouseEvent) => {
        if (get().isPanning) {
            const dx = e.clientX - get().startPosition.x;
            const dy = e.clientY - get().startPosition.y;

            set({curPosition: {
                x: get().curPosition.x + dx,
                y: get().curPosition.y + dy
            }})
            set({startPosition: {
                x: e.clientX,
                y: e.clientY
            }})
        }
    },

    mouseUpHandler: () => {
        set({isPanning: false});
    }
}))