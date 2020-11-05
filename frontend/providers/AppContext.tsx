import { useContext, createContext, useState, useEffect } from "react";
import { apiRest as api } from "../lib/api";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [appContext, setAppContext] = useState({
    theme: "light",
  });

  useEffect(() => {
    if (!user && api.getToken()) {
      api.users
        .me()
        .then((newUser) => {
          setUser(newUser);
        })
        .catch((e) => {
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{ appContext, setAppContext, user, setUser, isLoading }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
