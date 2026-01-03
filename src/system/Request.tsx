import { create } from "zustand";
import { configType, signFormType, userType } from "./Account";
import { links } from "../properties/links";

interface RequestProps {
    getUsers: () => Promise<userType[]>
    addUser: (v: signFormType) => Promise<Response | null>
    getUserById: (v: string) => Promise<userType | null>
    getUserByEmail: (v: string) => Promise<userType | null>
    setUserConfigById: (id: string, config: configType) => Promise<userType | null>
    addIconMeshUrlById: (id: string, prompt: string) => Promise<string | null>
}

export const useRequestStore = create<RequestProps>(() => ({

    ////// users //////

    getUsers: async (): Promise<userType[]> => {
        try {
            const response = await fetch(`${links.serverAddress}/users`);
            return await response.json() as userType[]
        }
        catch (error) {
            console.error('[Error] get user error :', error);
            return [];
        }
    },

    addUser: async (signFormData: signFormType): Promise<Response | null> => {
        try {
            const response = await fetch(`${links.serverAddress}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signFormData),
            });

            return response
        }
        catch (error) {
            console.error('[Error] add user error :', error);
            return null;
        }
    },

    ////// user //////
  
    getUserByEmail: async (email: string): Promise<userType | null> => {
        try {
          const response = await fetch(`${links.serverAddress}/user?email=${encodeURIComponent(email)}`);
          if (response.status === 200) {
              return await response.json() as userType;
          } else {
              return null;
          }
        } catch (error) {
          console.error('[Error] get user error :', error);
          return null;
        }
      },
  
    getUserById: async (id: string): Promise<userType | null> => {
      try {
        const response = await fetch(`${links.serverAddress}/user?id=${encodeURIComponent(id)}`);
        if (response.status === 200) {
            return await response.json() as userType;
        } else {
            return null;
        }
      } catch (error) {
        console.error('[Error] get user error :', error);
        return null;
      }
    },

    setUserConfigById: async (id: string, config: configType): Promise<userType | null> => {
        try {
            const response = await fetch(`${links.serverAddress}/user/config?id=${encodeURIComponent(id)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (response.status === 200) {
                return await response.json() as userType;
            } else {
                return null;
            }
        } catch (error) {
            console.error('[Error] set user error:', error);
            return null;
        }
    },

    addIconMeshUrlById: async (id: string, prompt: string): Promise<string | null> => {
        try {
            const response = await fetch(`${links.serverAddress}/meshes?id=${encodeURIComponent(id)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'prompt' : prompt }),
            });
            const responseJson = await response.json();

            if (response.status === 201) {
                return await responseJson['iconMeshUrl'];
            } else {
                console.log(`response error ${response.status}:`, responseJson);
                return null;
            }
        } catch (error) {
            console.error('[Error] set user error:', error);
            return null;
        }
    }
}))