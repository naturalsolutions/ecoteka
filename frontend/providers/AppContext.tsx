import { useContext, createContext, useState, useEffect } from "react";
import { IUser } from "@/index";
import { apiRest as api } from "@/lib/api";
import useLocalStorage from "@/lib/hooks/useLocalStorage";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useLocalStorage<IUser>("user", null);

  return (
    <StoreContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
