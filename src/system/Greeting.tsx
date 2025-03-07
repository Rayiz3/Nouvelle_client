import { Accessor, createSignal, Setter } from "solid-js";


class GreetingSys {
    isIconVisible: Accessor<boolean>
    setIsIconVisible: Setter<boolean>

    constructor () {
        ([this.isIconVisible, this.setIsIconVisible] = createSignal<boolean>(false))
    }
}

export const greetingSys = new GreetingSys();