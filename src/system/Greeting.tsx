import { create } from "zustand";

export interface greetingMessagesType {
    first: boolean;
    second: boolean;
    third: boolean;
}

interface GreetingProps {
    isIconVisible: boolean
    setIsIconVisible: (v: boolean) => void

    isMessageVisible: greetingMessagesType
    setIsMessageVisible: (s: keyof greetingMessagesType, v: boolean) => void
}

export const useGreetingStore = create<GreetingProps>((set, get) => ({
    isIconVisible: false,
    setIsIconVisible: (v) => set({isIconVisible: v}),
    isMessageVisible: {
        first: false,
        second: false,
        third: false,
    },
    setIsMessageVisible: (s, v) => set({isMessageVisible: {...get().isMessageVisible, [s]: v}}),
}))