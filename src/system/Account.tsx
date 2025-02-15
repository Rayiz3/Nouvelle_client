import { Accessor, createSignal, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export interface signFormType {
    email: string;
    password: string;
    name: string;
}

class AccountSys {
    isScrolledDown: Accessor<boolean>
    setIsScrolledDown: Setter<boolean>

    isSignup: Accessor<boolean>
    setIsSignup: Setter<boolean>

    signForm: HTMLDivElement | undefined

    signFormData: signFormType
    setSignFormData: SetStoreFunction<signFormType>

    constructor() {
        ([this.isScrolledDown, this.setIsScrolledDown] = createSignal<boolean>(false)),
        ([this.isSignup, this.setIsSignup] = createSignal<boolean>(false)),
        (this.signForm = undefined),
        ([this.signFormData, this.setSignFormData] = createStore<signFormType>({
            email: "",
            password: "",
            name: ""
        }))
    }

    scrollHandler = () => {
        this.setIsScrolledDown(window.scrollY > (window.innerHeight / 2));
    }

    transitionDown = () => {
        if (this.signForm) {
            this.signForm.scrollIntoView({
                behavior: "smooth", // Smooth scrolling
                block: "start", // Align the top of the element to the top of the viewport
            });
        }
    };
}

export const accountSys = new AccountSys();