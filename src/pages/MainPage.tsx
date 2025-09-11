import { useEffect } from "react";
import { useMainStore } from "../system/Main";
import { useRequestStore } from "../system/Request";
import Greetings from "../components/Greetings";
import { useAccountStore } from "../system/Account";
import { useGreetingStore } from "../system/Greeting";
import MainFooter from "../layouts/MainFooter";
import HexaMap from "../components/HexaMap";
import MainHeader from "../layouts/MainHeader";

const MainPage: React.FC = () => {
    const setUsers = useMainStore(state => state.setUsers);
    const setCurUser = useAccountStore(state => state.setCurUser);
    const getUsers = useRequestStore(state => state.getUsers);

    useEffect(() => {
        const savedUser = localStorage.getItem("curUser");
        if(savedUser) {
            setCurUser(JSON.parse(savedUser));
        }
        
        (async () => setUsers(await getUsers()))();
    }, [])

    return (
        <div className="
            w-[100vw] h-[100vh]
            flex items-center justify-center
            bg-main font-thin overflow-clip
        ">
            {!useGreetingStore.getState().isIconVisible && <Greetings />}
            <MainHeader />
            <HexaMap />
            <MainFooter />
        </div>
    )
}

export default MainPage;