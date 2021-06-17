import { useContext, createContext, useState, useEffect } from "react";
import { IOrganization, IUser } from "@/index";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { useSnackbar } from "notistack";

const StoreContext = createContext({} as any);

export const Provider = ({ children }) => {
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);
  const [organizationError, setOrganizationError] = useState(undefined);
  const [user, setUser] = useLocalStorage<IUser>("user");
  const [organization, setOrganization] = useLocalStorage<IOrganization>(
    "etk:appContext:organization"
  );
  const router = useRouter();
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

  const defaultValues = () => {
    setOrganization(undefined);
    setIsOrganizationLoading(false);
    setOrganizationError(undefined);
  };

  const fetchOrganization = async (organizationSlug: string) => {
    try {
      defaultValues();
      setIsOrganizationLoading(true);

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

      setIsOrganizationLoading(false);
    } catch (error) {
      defaultValues();
      setOrganizationError({
        message: error.response.data?.detail,
        code: error.response?.status,
      });
    }
  };

  useEffect(() => {
    const { organizationSlug } = router.query;

    if (organizationSlug && organization?.slug !== organizationSlug) {
      fetchOrganization(organizationSlug as string);
    }
  }, [router.query]);

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
        isOrganizationLoading,
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
