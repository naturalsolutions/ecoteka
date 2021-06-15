import { useContext, createContext, useState, useEffect } from "react";
import { IOrganization, IUser } from "@/index";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { useSnackbar } from "notistack";

const StoreContext = createContext({} as any);

const initialOrganizationState = {
  organization: undefined,
  error: undefined,
  isLoading: false,
};

export const Provider = ({ children }) => {
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);
  const [organizationState, setOrganizationState] = useState(
    initialOrganizationState
  );
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

  const fetchOrganization = async (organizationSlug: string) => {
    try {
      setOrganizationState({
        isLoading: true,
        organization: undefined,
        error: undefined,
      });

      const { data, status } = await apiETK.get(
        `/organization/${organizationSlug}`,
        {
          params: {
            mode: "by_slug",
          },
        }
      );

      if (status === 200) {
        setOrganizationState({
          isLoading: false,
          organization: data,
          error: undefined,
        });
      }

      setIsOrganizationLoading(false);
    } catch (error) {
      setOrganizationState({
        isLoading: false,
        organization: undefined,
        error: {
          message: error.response?.data?.detail,
          code: error.response?.status,
        },
      });
    }
  };

  useEffect(() => {
    const { organizationSlug } = router.query;

    if (organizationSlug) {
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
        organization: organizationState.organization,
        setOrganization,
        isOrganizationLoading: organizationState.isLoading,
        organizationError: organizationState.error,
        refetchUserData,
        fetchOrganization,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAppContext = () => useContext(StoreContext);
