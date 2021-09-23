import { createContext, useContext, useState } from "react";

type BGContextType = {
  bg: string;
  setBg: (newBg: string) => void;
};

const BGContext = createContext<BGContextType | undefined>(undefined);
function BGProvider({ children }) {
  const [state, setState] = useState<string>("");
  const value = { bg: state, setBg: setState };

  return <BGContext.Provider value={value}>{children}</BGContext.Provider>;
}

function useBG() {
  const context = useContext(BGContext);
  if (context === undefined) {
    throw new Error("should inside provider");
  }
  return context;
}

export { BGProvider, useBG };
