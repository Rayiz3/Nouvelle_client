import { Accessor, createEffect, createSignal, onMount, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { requestSys } from "./Request";
import { links } from "../properties/links";

export interface signFormType {
    email: string;
    password: string;
    name: string;
}

export interface userType extends signFormType {
    _id: { $oid: string };
}

class AccountSys {
    isScrolledDown: Accessor<boolean>
    setIsScrolledDown: Setter<boolean>

    isSignup: Accessor<boolean>
    setIsSignup: Setter<boolean>

    signForm: HTMLDivElement | undefined

    signFormData: signFormType
    setSignFormData: SetStoreFunction<signFormType>

    curUser: userType
    setCurUser: SetStoreFunction<userType>

    constructor() {
        ([this.isScrolledDown, this.setIsScrolledDown] = createSignal<boolean>(false)),
        ([this.isSignup, this.setIsSignup] = createSignal<boolean>(false)),
        (this.signForm = undefined),
        ([this.signFormData, this.setSignFormData] = createStore<signFormType>({
            email: "",
            password: "",
            name: ""
        })),
        ([this.curUser, this.setCurUser] = createStore<userType>({
            _id: { $oid: '' },
            email: '',
            password: '',
            name: ''
        }))

        onMount(() => {
            const savedUser = localStorage.getItem("curUser");
            console.log('local storage:', savedUser);
            if(savedUser) {
                this.setCurUser(JSON.parse(savedUser))
                console.log(this.curUser)
            }
        })
    }

    scrollHandler = () => {
        this.setIsScrolledDown(window.scrollY > (window.innerHeight / 2));
    }

    transitionDown = () => {
        if (this.signForm) {
            this.signForm.scrollIntoView({
                behavior: 'smooth',
                block: "start", // Align the top of the element to the top of the viewport
            });
        }
    };

    SignupHandler = async () => {
        const response = await requestSys.addUser(this.signFormData)

        if(response){
            const data = await response.json();

            if(response.status === 201) {
                window.location.href = links.clientAddress+"/main"
            } else {
                console.error('[Error] add user error :', data.message)
            }
        }
    }

    signinHandler = async () => {
        const foundUser = await requestSys.getUserByEmail(this.signFormData.email);
        
        if (foundUser != null) {
            localStorage.setItem("curUser", JSON.stringify(foundUser));
            window.location.href = links.clientAddress + "/main";
        } else {
            console.log("login failed");
        }
    }

    logoutHandler = () => {
        localStorage.removeItem('curUser');
        window.location.href = '/';
    }
}

export const accountSys = new AccountSys();