import { useContext, createContext, useState, useEffect } from "react";
import { IUser } from "@/index";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { withSnackbar, useSnackbar } from "notistack";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isLoading] = useState(false);
  const [user, setUser] = useLocalStorage<IUser>("user");
  const router = useRouter();
  const { apiETK } = useApi().api;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const validRoutes = [
    "/",
    "/signin",
    "/forgot",
    "/verify/[token]",
    "/users/set_password",
    "/404",
    "/500",
  ];

  // #HOTFIX: In the long terThis could be replace by useReducer hook to programatically interacts with current user state
  // (e.g: update user organizations lists) based on query results
  const refetchUserData = async () => {
    const currentOrganization = user.currentOrganization;
    try {
      const { data, status } = await apiETK.get("/users/me");
      if (status === 200) {
        if (data) {
          setUser({
            ...data,
            currentOrganization: data.organizations.find(
              (organization) => organization.id === currentOrganization.id
            ),
          });
        }
      }
    } catch ({ response, request }) {
      if (response) {
        const { statusText } = response;
        enqueueSnackbar(`${statusText}`, {
          variant: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (!validRoutes.includes(router.route) && !user) {
      router.push("/");
    }
  }, [user]);

  return (
    <StoreContext.Provider
      value={{ user, setUser, isLoading, refetchUserData }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
