import { useContext, createContext, useState, useEffect } from "react";
import { apiRest as api } from "../lib/api";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
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
    <StoreContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
