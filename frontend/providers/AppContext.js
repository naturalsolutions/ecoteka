import { useContext, createContext, useState } from "react";

const StoreContext = createContext();

export const Provider = ({ children }) => {
  const [appContext, setAppContext] = useState({
    theme: "light",
  });

  return (
    <StoreContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
