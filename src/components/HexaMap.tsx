import React from "react";
import { useGreetingStore } from "../system/Greeting";
import { useMainStore } from "../system/Main";
import HexaGrid from "./HexaGrid";

const fadeStyle = (signal: boolean) => { return `
    flex justify-center items-center w-[100vw] h-[100vh] absolute
    ${signal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    transition-opacity duration-1000 ease-in-out
`}

const HexaMap: React.FC = () => {
    const isIconVisible = useGreetingStore(state => state.isIconVisible);
    const wheelHandler = useMainStore(state => state.wheelHandler);
    const mouseMoveHandler = useMainStore(state => state.mouseMoveHandler);
    const mouseUpHandler = useMainStore(state => state.mouseUpHandler);
    const mouseDownHandler = useMainStore(state => state.mouseDownHandler);
    const scale = useMainStore(state => state.scale);
    const curPosition = useMainStore(state => state.curPosition);

    return (
        <div className={fadeStyle(isIconVisible)}>
            {isIconVisible && 
                <div className={`
                    flex flex-col items-center justify-center
                    w-full h-full overflow-clip`}
                    onWheel={wheelHandler}
                    onMouseMove={mouseMoveHandler}
                    onMouseUp={mouseUpHandler}
                    onMouseDown={mouseDownHandler}
                    onMouseLeave={mouseUpHandler}>
                    
                    <div className="transition-transform duration-100 ease-in-out"
                        style={{
                            transform: `
                                scale(${scale})
                                translate(${curPosition.x}px, ${curPosition.y}px)`,
                        }}>
                        <HexaGrid />
                    </div>
                </div>
            }
        </div>
    )
}

export default HexaMap;