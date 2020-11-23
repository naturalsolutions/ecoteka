import { useContext, createContext, useState, useEffect } from "react";
import { IUser } from "@/index";
import { apiRest as api } from "@/lib/api";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && api.getToken()) {
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
