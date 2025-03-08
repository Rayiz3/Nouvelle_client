import { Accessor, createSignal, Setter } from "solid-js";


class MainSys {
    isFilterOn: Accessor<boolean>
    setIsFilterOn: Setter<boolean>

    searchingQuery: Accessor<string>
    setSearchingQuery: Setter<string>

    constructor () {
        ([this.isFilterOn, this.setIsFilterOn] = createSignal<boolean>(false)),
        ([this.searchingQuery, this.setSearchingQuery] = createSignal<string>(""))
    }
}

export const mainSys = new MainSys();