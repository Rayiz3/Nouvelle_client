import { Component, onCleanup, onMount } from "solid-js";
import { accountSys } from "../system/Account";
import { SigninForm, SignupForm } from "../components/SignForm";

const flexCenterStyle = "flex flex-col items-center justify-center w-full h-[100vh]";

const signinTransitionStyle = () => {return `
  transition-opacity duration-1000 ease-in-out
  ${accountSys.isScrolledDown() ? 'opacity-100 visible' : 'opacity-0 invisible'}
`}

const LandingPage: Component = () => {
  onMount(() => {
    // place scroll to the top at first
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // scroll handler
    window.addEventListener('scroll', accountSys.scrollHandler);
  })

  onCleanup(() => {
    // scroll handler
    window.removeEventListener('scroll', accountSys.scrollHandler);
  })

    return (
      <div class="flex flex-col items-center h-[200vh] bg-main font-pretendard font-thin overflow-y-auto">
        
        <div class={`${flexCenterStyle} text-center`}>
          <div class="text-size-title text-sub z-20">
            Nouvelle Vague
          </div>
          <div class="w=[60vw] text-2xl text-plain mb-12">
            새로운 공간에서 당신의 이야기가 펼쳐집니다.
          </div>
          <button class={ `
            border border-sub rounded-lg
            text-size-startButton text-sub
            px-6 py-2
            cursor-pointer
            hover:bg-sub hover:text-main
            transition-colors
          `} onClick={accountSys.transitionDown}>
            {accountSys.isSignup()? "Register" : "Get start"}
          </button>
        </div>

        <div ref={accountSys.signForm}
             class={`${flexCenterStyle} relative ${signinTransitionStyle()}`}>
            <SigninForm />
            <SignupForm />
        </div>

      </div>
    );
}

export default LandingPage