import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useApi from "@/lib/useApi";
import { IOrganization } from "@/index";
import { Button } from "@material-ui/core";
import { AxiosError } from "axios";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import { formatDistance, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";

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
      onError: (data) => {
        if (data?.response?.status == 404) {
          console.log(data);
          router.push("/404");
        }
      },
    }
  );

  return (
    <div>
      {isLoading && <FullPageSpinner />}
      {isError && <FullPageSpinner />}
      {isSuccess && (
        <div>
          <Button variant="contained" onClick={() => router.push("/admin")}>
            Retour
          </Button>
          <p>Nom: {organizationData.name}</p>
          <p>ID: {organizationData.id}</p>
          <p>Slug: {organizationData.slug}</p>
          <p>Mode applicatif: {organizationData.mode}</p>
          <p>Nombre d'arbres: {organizationData.total_trees}</p>
          <p>INombres de membres: {organizationData.total_members}</p>
          <p>
            Mise à jour{" "}
            {formatDistance(new Date(organizationData.updated_at), new Date(), {
              addSuffix: true,
              locale: fr,
            })}
          </p>
          <p>OSM ID: {organizationData.osm_id}</p>
          <p>
            Status de publication:{" "}
            {organizationData.archived ? "Archivé" : "Publié"}
          </p>
          <p>
            Votre rôle dans cette organization:{" "}
            {organizationData.current_user_role}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationHome;
