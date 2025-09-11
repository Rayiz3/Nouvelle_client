import { createRef, RefObject } from "react";
import { create } from "zustand";

export interface configType {
    color: string;
    stacks: string[];
    links: string[];
}

export interface signFormType {
    email: string;
    password: string;
    name: string;
}

export interface userType extends signFormType {
    _id: string;
    config: configType;
}

interface AccountProps {
    isScrolledDown: boolean
    setIsScrolledDown: (v: boolean) => void

    isSignup: boolean
    setIsSignup: (v: boolean) => void

    signFormData: signFormType
    setSignFormData: (v: signFormType) => void

    curUser: userType
    setCurUser: (v:userType) => void

    signForm: RefObject<HTMLDivElement | null>

    init: () => void
    scrollHandler: () => void
    transitionDown: () => void
}

export const useAccountStore = create<AccountProps>((set, get) => ({
    isScrolledDown: false,
    setIsScrolledDown: (v) => set({isScrolledDown: v}),
    isSignup: false,
    setIsSignup: (v) => set({isSignup: v}),
    signFormData: {
        email: '',
        password: '',
        name: '',
    },
    setSignFormData: (v) => set({signFormData: v}),
    curUser: {
        _id: '',
        email: '',
        password: '',
        name: '',
        config: {
            color: '#ffffff',
            stacks: [],
            links: [],
        }
    },
    setCurUser: (v) => set({curUser: v}),
    signForm: createRef<HTMLDivElement>(),
    
    init: () => {
      const savedUser = localStorage.getItem("curUser");
      if (savedUser) set({ curUser: JSON.parse(savedUser) });
    },

    scrollHandler: () => {
        get().setIsScrolledDown(window.scrollY > (window.innerHeight / 2));
    },

    transitionDown: () => {
        get().signForm.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start', // Align the top of the element to the top of the viewport
        })
    },
}));