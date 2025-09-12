//import { links } from "../properties/links";
import { useAccountStore } from "../system/Account";
import { useRequestStore } from "../system/Request";
import InputTextbox from "./InputTextbox";

const signinTransitionStyle = (sign: boolean) => {return `
    transition-opacity duration-1000 ease-in-out
    ${sign ? 'opacity-100 visible' : 'opacity-0 invisible'}
`}

const buttonStyle = `
    bg-sub
    text-main text-xl font-light rounded-md
    w-[20vw]
    mt-20 py-2
    cursor-pointer
    hover:bg-white
    transition-colors
`

const SignForm: React.FC<{signin: boolean}> = ({signin}) => {
    const isSignup = useAccountStore(state => state.isSignup);
    const setIsSignup = useAccountStore(state => state.setIsSignup);
    const signFormData = useAccountStore(state => state.signFormData);
    const setSignFormData = useAccountStore(state => state.setSignFormData);
    const getUserByEmail = useRequestStore(state => state.getUserByEmail);
    const addUser = useRequestStore(state => state.addUser);

    // handlers
    const signinHandler = async () => {
        const foundUser = await getUserByEmail(signFormData.email);
        if (foundUser) {
            localStorage.setItem("curUser", JSON.stringify(foundUser));
            window.location.href = `/main`;
        }
    };
    
    const signupHandler = async () => {
        const res = await addUser(signFormData);
        const foundUser = await getUserByEmail(signFormData.email);
        if (res?.status === 201) {
            localStorage.setItem("curUser", JSON.stringify(foundUser));
            window.location.href = `/main`;
        }
    };

    return (
        <div className={`absolute w-[20vw] mt-[10vh] ${signinTransitionStyle(signin? !isSignup : isSignup)}`}>
            {!signin && <>
            <InputTextbox inputType='text' storingData="name">
                Name
            </InputTextbox>

            <div className="m-14"/>
            </>}

            <InputTextbox inputType='text' storingData="email">
                Email
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox inputType='password' storingData="password">
                Password
            </InputTextbox>

            <div className="flex flex-col items-center w-full">
                <button className={buttonStyle} onClick={() => signin? signinHandler() : signupHandler()}>
                    {signin? "Sign in" : "Sign up"}
                </button>
                <div className="text-plain text-xl mt-7 cursor-pointer hover:text-white transition-colors"
                     onClick={() => {
                        setIsSignup(!isSignup);
                        setSignFormData({name: '', email: '', password: ''})
                     }}>
                    {signin? "Register" : "Go Back"}
                </div>
            </div>
        </div>
    )
}

export default SignForm;