import { links } from "../properties/links";
import { accountSys, signFormType, userType } from "./Account";

class RequestSys {

    ////// users //////

    addUser = async (signFormData: signFormType) => {
        try {
            const response = await fetch(`${links.serverAddress}/users/`, {
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
    }

    ////// user //////

    getUserByEmail = async (email: string): Promise<userType | null> => {
        try {
            const response = await fetch(`${links.serverAddress}/user?email=${ encodeURIComponent(email)}`)
            return await response.json() as userType
        }
        catch (error) {
            console.error('[Error] get user error :', error);
            return null;
        }
    }
}

export const requestSys = new RequestSys();