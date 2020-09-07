import { useContext, createContext, useState } from "react";

const StoreContext = createContext();

const AppContextProvider = ({ children }) => {
  const [appContext, setAppContext] = useState({
    theme: 'light'
  });

  return (
    <StoreContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </StoreContext.Provider>
  );
}

const useAppContext = () =>  useContext(StoreContext)

export default {
  AppContextProvider,
  useAppContext
}
