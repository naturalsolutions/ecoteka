import { useContext, createContext, useState, useEffect } from "react";
import { IOrganization, IUser } from "@/index";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { withSnackbar, useSnackbar } from "notistack";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isLoading] = useState(false);
  const [user, setUser] = useLocalStorage<IUser>("user");
  const [organization, setOrganization] = useLocalStorage<IOrganization>(
    "etk:appContext:organization"
  );
  const router = useRouter();
  const { apiETK } = useApi().api;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const validRoutes = [
    "/",
    "/index-legacy",
    "/home",
    "/signin",
    "/forgot",
    "/verify/[token]",
    "/users/set_password",
    "/404",
    "/500",
  ];
  const restrictedRoutes = ["/admin/organizations", "account"];

  // #HOTFIX: In the long terThis could be replace by useReducer hook to programatically interacts with current user state
  // (e.g: update user organizations lists) based on query results
  const refetchUserData = async () => {
    try {
      const { data, status } = await apiETK.get("/users/me");

      if (status === 200) {
        if (data) {
          setUser({
            ...data,
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

  const fetchOrganization = async (organizationSlug: string) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationSlug}`,
        {
          params: {
            mode: "by_slug",
          },
        }
      );

      if (status === 200) {
        setOrganization(data);
      }
    } catch ({ response }) {
      if (response) {
        enqueueSnackbar(`${response.statusText}`, { variant: "error" });
      }
    }
  };

  useEffect(() => {
    const { organizationSlug } = router.query;

    if (
      (organizationSlug && organization?.slug !== organizationSlug) ||
      !organization
    ) {
      fetchOrganization(organizationSlug as string);
    }
  }, [router.query?.organizationSlug]);

  useEffect(() => {
    if (restrictedRoutes.includes(router.route) && !user) {
      router.push("/");
    }
  }, [user]);

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        organization,
        setOrganization,
        isLoading,
        refetchUserData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
