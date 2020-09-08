import { useContext, createContext, useState } from "react";
import { apiRest as api } from "../lib/api";

const StoreContext = createContext();

export const Provider = ({ children }) => {
  const [hasUser, setHasUser] = useState(false);
  const [appContext, setAppContext] = useState({
    theme: "light",
    user: null,
  });

  if (!appContext.user && api.getToken() && !hasUser) {
    api.users.me().then((user) => {
      setHasUser(true);
      setAppContext({
        ...appContext,
        user,
      });
    });
  }

  return (
    <StoreContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
