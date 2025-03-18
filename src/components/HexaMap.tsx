import { Component } from "solid-js";
import { mainSys } from "../system/Main";
import HexaGrid from "./HexaGrid";

const HexaMap: Component = () => {
    return (
        <div class={`
            flex flex-col items-center justify-center
            w-full h-full overflow-clip`}
            onWheel={mainSys.wheelHandler}
            onMouseMove={mainSys.mouseMoveHandler}
            onMouseUp={mainSys.mouseUpHandler}
            onMouseDown={mainSys.mouseDownHandler}
            onMouseLeave={mainSys.mouseUpHandler}>

            <div class="transition-transform duration-100 ease-in-out"
                style={{
                    transform: `
                        scale(${mainSys.scale()})
                        translate(${mainSys.curPosition.x}px, ${mainSys.curPosition.y}px)`,
                }}>
                <HexaGrid />
            </div>
        </div>
    )
}

export default HexaMap