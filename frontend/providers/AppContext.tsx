import { useContext, createContext, useState, useEffect } from "react";
import { IOrganization, IUser } from "@/index";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { useSnackbar } from "notistack";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isLoading] = useState(false);
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(true);
  const [isOrganizationSuccess, setIsOrganizationSuccess] = useState(true);
  const [organizationError, setOrganizationError] = useState(undefined);
  const [user, setUser] = useLocalStorage<IUser>("user");
  const [organization, setOrganization] = useLocalStorage<IOrganization>(
    "etk:appContext:organization"
  );
  const router = useRouter();
  const { isReady, query } = router;
  const { apiETK } = useApi().api;
  const { enqueueSnackbar } = useSnackbar();
  const restrictedRoutes = ["/admin/organizations", "account"];

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
      setIsOrganizationLoading(true);
      setOrganizationError(undefined);
      // setOrganization(undefined); //Refact needed! We need to programatically deal with undefined organization
      setIsOrganizationSuccess(true); //This is weird!
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
        setIsOrganizationSuccess(true);
      }
    } catch ({ response }) {
      setOrganization(undefined);
      setIsOrganizationLoading(false);
      setIsOrganizationSuccess(false);
      setOrganizationError(response);
    } finally {
      setIsOrganizationLoading(false);
    }
  };

  useEffect(() => {
    const { organizationSlug } = query;
    if (
      (organizationSlug &&
        organization?.slug !== organizationSlug &&
        isReady) ||
      (!organization && isReady)
    ) {
      fetchOrganization(organizationSlug as string);
    } else {
      setIsOrganizationLoading(!isReady as boolean);
    }
  }, [router.query?.organizationSlug, isReady]);

  useEffect(() => {
    if (!user && restrictedRoutes?.includes(router.route)) {
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
        isOrganizationLoading,
        isOrganizationSuccess,
        organizationError,
        refetchUserData,
        fetchOrganization,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
