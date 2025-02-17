import { Component } from "solid-js";
import { accountSys } from "../system/Account";
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

export const SigninForm: Component = () => {
    return (
        <div class={`absolute w-[20vw] mt-[10vh] ${signinTransitionStyle(!accountSys.isSignup())}`}>
            <InputTextbox inputType='text' storingData="email">
                Email
            </InputTextbox>

            <div class="m-14"/>

            <InputTextbox inputType='password' storingData="password">
                Password
            </InputTextbox>

            <div class="flex flex-col items-center w-full">
                <button class={buttonStyle}>
                    Sign in
                </button>
                <div class="text-plain text-xl mt-7 cursor-pointer hover:text-white transition-colors"
                     onClick={() => {
                        accountSys.setIsSignup(true)
                        accountSys.setSignFormData({name: '', email: '', password: ''})
                     }}>
                    Register
                </div>
            </div>
        </div>
    )
}

export const SignupForm: Component = () => {
    return (
        <div class={`absolute w-[20vw] mt-[10vh] ${signinTransitionStyle(accountSys.isSignup())}`}>
            <InputTextbox inputType='text' storingData="name">
                Name
            </InputTextbox>

            <div class="m-14"/>

            <InputTextbox inputType='text' storingData="email">
                Email
            </InputTextbox>

            <div class="m-14"/>

            <InputTextbox inputType='password' storingData="password">
                Password
            </InputTextbox>

            <div class="flex flex-col items-center w-full">
                <button class={buttonStyle}>
                    Sign up
                </button>
                <div class="text-plain text-xl mt-7 cursor-pointer hover:text-white transition-colors"
                     onClick={() => {
                        accountSys.setIsSignup(false)
                        accountSys.setSignFormData({name: '', email: '', password: ''})
                     }}>
                    Go Back
                </div>
            </div>
        </div>
    )
}