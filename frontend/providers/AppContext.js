import { useContext, createContext, useState } from "react";
import { apiRest as api } from "../lib/api";

const StoreContext = createContext();

export const Provider = ({ children }) => {
  const [user, setUser] = useState();
  const [appContext, setAppContext] = useState({
    theme: "light",
  });

  if (!user && api.getToken()) {
    api.users.me().then((newUser) => {
      setUser(newUser);
    });
  }

  return (
    <StoreContext.Provider value={{ appContext, setAppContext, user, setUser }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
