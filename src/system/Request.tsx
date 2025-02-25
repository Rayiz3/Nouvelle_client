import { links } from "../properties/links";
import { accountSys } from "./Account";

class RequestSys {

    ////// users //////

    addUser = async () => {
        console.log(accountSys.signFormData);
        try {
            const response = await fetch(links.serverAddress+"/users/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountSys.signFormData),
            });
            
            const data = await response.json();

            if(response.status === 201) {
                window.location.href = links.clientAddress+"/"
            } else {
                console.error('[Error] sign up error :', data.message)
            }
        }
        catch (error) {
            console.error('[Error] sign up error :', error);
        }
    }
}

export const requestSys = new RequestSys();