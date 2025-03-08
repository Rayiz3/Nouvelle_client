import { Accessor, createSignal, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";


export interface greetingMessagesType {
    first: boolean;
    second: boolean;
    third: boolean;
}

class GreetingSys {
    isIconVisible: Accessor<boolean>
    setIsIconVisible: Setter<boolean>

    isMessageVisible: greetingMessagesType
    setIsMessageVisible: SetStoreFunction<greetingMessagesType>

    constructor () {
        ([this.isIconVisible, this.setIsIconVisible] = createSignal<boolean>(false)),
        ([this.isMessageVisible, this.setIsMessageVisible] = createStore<greetingMessagesType>({
            first: false,
            second: false,
            third: false
        }))
    }

    timeInterval: number = 1500
}

export const greetingSys = new GreetingSys();