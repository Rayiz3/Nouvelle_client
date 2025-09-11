import React, { useEffect, useRef } from "react";
import { useAccountStore, signFormType } from "../system/Account";

interface InputTextboxProps {
  inputType: string;
  storingData: keyof signFormType;
  children: React.ReactNode;
}

const InputTextbox: React.FC<InputTextboxProps> = ({ inputType, storingData, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const signFormData = useAccountStore(state => state.signFormData);
  const setSignFormData = useAccountStore(state => state.setSignFormData);

  useEffect(() => {
    if (inputRef.current) {
      setSignFormData({ ...signFormData, [storingData]: inputRef.current.value });
    }
  }, []);

  return (
    <div>
      <label className="block text-plain text-xl">
        {children}
      </label>
      <input
        ref={inputRef}
        type={inputType}
        value={signFormData[storingData] || ""}
        onChange={e => setSignFormData({ ...signFormData, [storingData]: e.currentTarget.value })}
        className="bg-transparent w-full h-16 text-plain text-2xl p-2 border-plain border-b focus:outline-none"
      />
    </div>
  );
};

export default InputTextbox;