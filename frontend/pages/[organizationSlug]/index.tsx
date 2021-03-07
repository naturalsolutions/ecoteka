import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useApi from "@/lib/useApi";

import { IOrganization } from "@/index";
import { Button } from "@material-ui/core";
import { AxiosError } from "axios";

const OrganizationHome = () => {
  const router = useRouter();
  const { organizationSlug } = router.query;
  const { apiETK } = useApi().api;
  const fetchOrga = async () => {
    const { data } = await apiETK.get(
      `/organization/${organizationSlug}?mode=by_slug`
    );
    return data;
  };

  const {
    isLoading,
    isSuccess,
    error,
    isError,
    data: organizationData,
  } = useQuery<IOrganization, AxiosError>(
    [`orga`, organizationSlug],
    fetchOrga,
    {
      enabled: !!organizationSlug,
    }
  );

  return (
    <div>
      {isLoading && <div>...Chargement des données de l'organisation </div>}
      {isError && (
        <div>
          <div>{error.response?.data?.detail}</div>
          <Button variant="contained" onClick={() => router.push("/home-1")}>
            To Ecoteka
          </Button>
        </div>
      )}
      {isSuccess && (
        <div>
          <p>Nom: {organizationData.name}</p>
          <p>ID: {organizationData.id}</p>
          <p>Slug: {organizationData.slug}</p>
          <p>Mode: {organizationData.updated_at}</p>
          <p>OSM ID: {organizationData.osm_id}</p>
          <p>Is Archived: {organizationData.archived.toString()}</p>
          <Button variant="contained" onClick={() => router.push("/brest")}>
            To Brest
          </Button>
          <Button variant="contained" onClick={() => router.push("/home-1")}>
            To Ecoteka
          </Button>
          <Button variant="contained" onClick={() => router.push("/rennes")}>
            To Rennes
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizationHome;
