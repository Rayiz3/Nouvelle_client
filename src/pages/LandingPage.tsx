import React, { useEffect } from 'react';
import { useAccountStore } from '../system/Account';
import SignForm from '../components/SignForm';
//import { SigninForm, SignupForm } from '../components/SignForm';

const flexCenterStyle = "flex flex-col items-center justify-center w-full h-[100vh]";

const LandingPage: React.FC = () => {
    const isScrolledDown = useAccountStore(state => state.isScrolledDown);
    const isSignup = useAccountStore(state => state.isSignup);
    const signForm = useAccountStore(state => state.signForm);
    const init = useAccountStore(state => state.init);
    const scrollHandler = useAccountStore(state => state.scrollHandler);
    const transitionDown = useAccountStore(state => state.transitionDown);

    useEffect(() => {
        init();

        // place scroll to the top at first
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        // scroll handler
        window.addEventListener("scroll", scrollHandler);
        return () => window.removeEventListener("scroll", scrollHandler);
    }, []);

    const signinTransitionStyle = () => {return `
        transition-opacity duration-1000 ease-in-out
        ${isScrolledDown? 'opacity-100 visible' : 'opacity-0 invisible'}
    `}

    return (
        <div className="flex flex-col items-center h-[200vh] bg-main font-pretendard font-thin overflow-y-auto">
            <div className={`${flexCenterStyle} text-center`}>
                <div className="text-size-title text-sub z-20">
                    Nouvelle Vague
                </div>
                <div className="w=[60vw] text-2xl text-plain mb-12">
                    새로운 공간에서 당신의 이야기가 펼쳐집니다.
                </div>
                <button className={ `
                  border border-sub rounded-lg
                  text-size-startButton text-sub
                  px-6 py-2
                  cursor-pointer
                  hover:bg-sub hover:text-main
                  transition-colors
                `} onClick={transitionDown}>
                  {isSignup? "Register" : "Get start"}
                </button>
            </div>

            <div ref={signForm}
                 className={`${flexCenterStyle} relative ${signinTransitionStyle()}`}>
                    <SignForm signin={true} />
                    <SignForm signin={false} />
            </div>
        </div>
    )
};

export default LandingPage;