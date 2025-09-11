import React from "react";
import { IconSearch } from "./Icons";

interface QueryTextboxProps {
    curQuery: string;
    setCurQuery: (v: string) => void;
    placeholder: string;
}

const QueryTextbox: React.FC<QueryTextboxProps> = ({curQuery, setCurQuery, placeholder}) => {
  return (
    <div className="flex flex-row w-3xs p-1 border-b border-plain">
        <input
            value={curQuery}
            onChange={(e) => setCurQuery(e.target.value)}
            placeholder={placeholder}
            className="text-xl text-plain bg-transparent mr-4 focus:outline-none"/>
        <IconSearch style="fill-plain" />
    </div>
  );
};

export default QueryTextbox;