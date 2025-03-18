import { Accessor, createSignal, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";


export interface Vector2 {
    x: number;
    y: number;
}

class MainSys {
    isFilterOn: Accessor<boolean>
    setIsFilterOn: Setter<boolean>

    searchingQuery: Accessor<string>
    setSearchingQuery: Setter<string>

    scale: Accessor<number>
    setScale: Setter<number>

    isPanning: Accessor<boolean>
    setIsPanning: Setter<boolean>

    startPosition: Vector2
    setStartPosition: SetStoreFunction<Vector2>

    curPosition: Vector2
    setCurPosition: SetStoreFunction<Vector2>

    constructor () {
        ([this.isFilterOn, this.setIsFilterOn] = createSignal<boolean>(false)),
        ([this.searchingQuery, this.setSearchingQuery] = createSignal<string>("")),
        ([this.scale, this.setScale] = createSignal<number>(1)),
        ([this.isPanning, this.setIsPanning] = createSignal<boolean>(false)),
        ([this.startPosition, this.setStartPosition] = createStore<Vector2>({x: 0, y: 0})),
        ([this.curPosition, this.setCurPosition] = createStore<Vector2>({x: 0, y: 0}))
    }

    wheelHandler = (e: WheelEvent) => {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.setScale((prev: number) => Math.min(Math.max(prev + delta, 0.5), 3))
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.setIsPanning(true);
        this.setStartPosition({x: e.clientX, y: e.clientY});
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.isPanning()) {
            const dx = e.clientX - this.startPosition.x;
            const dy = e.clientY - this.startPosition.y;

            this.setCurPosition({
                x: this.curPosition.x + dx,
                y: this.curPosition.y + dy
            })
            this.setStartPosition({
                x: e.clientX,
                y: e.clientY
            })
        }
    }

    mouseUpHandler = () => {
        this.setIsPanning(false)
    }
}

export const mainSys = new MainSys();