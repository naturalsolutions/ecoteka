import { useContext, createContext, useState, useEffect } from "react";
import { IUser } from "..";
import { apiRest as api } from "../lib/api";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && api.getToken()) {
      api.users
        .me()
        .then((currentUser: IUser) => {
          setUser(currentUser);

          currentUser.currentOrganization = currentUser.organizations.sort(
            (o1, o2) => o1.path < o2.path ? -1 : o1.path === o2.path ? 0 : 1
          )[0];

          return currentUser;
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
