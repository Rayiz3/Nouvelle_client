import { useEffect } from "react";
import { useGreetingStore } from "../system/Greeting";
import { useAccountStore } from "../system/Account";

const fadeStyle = (signal: boolean) => { return `
    flex justify-center items-center w-[100vw] h-[100vh] absolute
    ${signal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    transition-opacity duration-1000 ease-in-out
`}

const Greetings: React.FC = () => {
    const isIconVisible = useGreetingStore(state => state.isIconVisible);
    const setIsIconVisible = useGreetingStore(state => state.setIsIconVisible);
    const isMessageVisible = useGreetingStore(state => state.isMessageVisible);
    const setIsMessageVisible = useGreetingStore(state => state.setIsMessageVisible);
    const curUser = useAccountStore(state => state.curUser);
    const timeInterval = 1500;

    let timerFirst: number;
    let timerSecond: number;
    let timerThird: number;

    useEffect(() => {
        timerFirst = setTimeout(() => {
            setIsMessageVisible("first", true)
            setIsMessageVisible("third", false)
        }, timeInterval)

        timerSecond = setTimeout(() => {
            setIsMessageVisible("first", false)
            setIsMessageVisible("second", true)
        }, 2 * timeInterval)

        timerThird = setTimeout(() => {
            setIsMessageVisible("second", false)
            setIsMessageVisible("third", true)
        }, 3 * timeInterval)

        return () => {
            clearTimeout(timerFirst);
            clearTimeout(timerSecond);
            clearTimeout(timerThird);
        }
    }, []);

    return (
        <div className="
            flex flex-col justify-center items-center
            w-[100vw] h-[100vh] relative
            font-pretendard font-thin text-center text-size-mid text-plain">
            <div className={fadeStyle(isMessageVisible.first)}>
                {!isIconVisible && isMessageVisible.first && curUser.name &&
                    `${curUser.name}님`
                }
            </div>
            <div className={fadeStyle(isMessageVisible.second)}>
                {!isIconVisible && isMessageVisible.second && curUser.name &&
                    `안녕하세요`
                }
            </div>
            <div className={fadeStyle(isMessageVisible.third)}>
                {!isIconVisible && isMessageVisible.third && curUser.name &&
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            setIsMessageVisible("third", false);
                            setIsIconVisible(true);
                        }}>
                        클릭해서 시작
                    </button>
                }
            </div>
        </div>
    )
}

export default Greetings;