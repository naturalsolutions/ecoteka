import { useContext, createContext, useState, useEffect } from "react";
import { IUser } from "@/index";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useRouter } from "next/router";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useLocalStorage<IUser>("user");
  const router = useRouter();
  const validRoutes = ["/", "/signin", "/404", "/500"];

  useEffect(() => {
    if (!validRoutes.includes(router.route) && !user) {
      router.push("/");
    }
  }, [user]);

  return (
    <StoreContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
