import { create } from "zustand";
import { configType } from "./Account";

interface MyProps {
    isLoading: boolean
    setIsLoading: (v: boolean) => void

    isGameMode: boolean
    setIsGameMode: (v: boolean) => void

    isEdit: boolean;
    setIsEdit: (v: boolean) => void

    config: configType
    setConfig: (v: configType) => void

    editingColor: string
    setEditingColor: (v: string) => void

    editingStacks: string[]
    setEditingStacks: (v: string[]) => void
    addEditingStacks: (v: string) => void
    removeEditingStacks: (v: string) => void

    stackQuery: string
    setStackQuery: (v: string) => void
    filteredQueries: string[]
    setFilteredQueries: (v: string[]) => void

    editingLinks: string[]
    setEditingLinks: (v: string[]) => void
    setEditingLinksByIdx: (i: number, v: string) => void
    addEditingLinks: (v: string) => void
    removeEditingLinks: (v: number) => void

    maxLinkIdx: number
    focusedLinkIdx: number
    setFocusedLinkIdx: (v: number) => void
}

export const useMyStore = create<MyProps>((set) => ({
    isLoading: true,
    setIsLoading: (v) => set({isLoading: v}),
    isGameMode: false,
    setIsGameMode: (v) => set({isGameMode: v}),
    isEdit: false,
    setIsEdit: (v) => set({isEdit: v}),
    config: {
        color: '#ffffff',
        stacks: [],
        links: [],
    },
    setConfig: (v) => set({config: v}),
    editingColor: '#ffffff',
    setEditingColor: (v) => set({editingColor: v}),

    editingStacks: [],
    setEditingStacks: (v) => set({editingStacks: v}),
    addEditingStacks: (v) => {
        set((state) => ({
          editingStacks: state.editingStacks.includes(v)
            ? state.editingStacks
            : [...state.editingStacks, v],
        }));
    },
    removeEditingStacks: (v) => {
        set((state) => ({
          editingStacks: state.editingStacks.filter(e => e !== v),
        }));
    },

    stackQuery: '',
    setStackQuery: (v) => set({stackQuery: v}),
    filteredQueries: [],
    setFilteredQueries: (v) => set({filteredQueries: v}),

    editingLinks: [],
    setEditingLinks: (v) => set({editingLinks: v}),
    setEditingLinksByIdx: (idx, v) => set((state) => ({
        editingLinks: state.editingLinks.map((e, i) => i === idx? v : e)
    })),
    addEditingLinks: (v) => {
        set((state) => ({
          editingLinks: [...state.editingLinks, v],
        }));
    },
    removeEditingLinks: (v) => {
        set((state) => ({
          editingLinks: state.editingLinks.filter((_, i) => i !== v),
        }));
    },

    maxLinkIdx: 5,
    focusedLinkIdx: -1,
    setFocusedLinkIdx: (v) => set({focusedLinkIdx: v}),
}))