import { useContext, createContext, useState, useEffect } from "react";
import { IUser } from "@/index";
import { apiRest as api } from "@/lib/api";
import useLocalStorage from "@/lib/hooks/useLocalStorage";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useLocalStorage<IUser>("user", null);

  useEffect(() => {
    if (!user) {
      api.users
        .me()
        .then((currentUser: IUser) => {
          if (currentUser.organizations.length === 1) {
            currentUser.currentOrganization = currentUser.organizations[0];
          }

          setUser(currentUser);
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
