import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import useApi from "@/lib/useApi";
import { IOrganization } from "@/index";
import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import FormOrganizationRoot, {
  FormOrganizationRootActions,
} from "@/components/Admin/Organization/Form";
import BasicForm from "@/components/Admin/Organization/BasicForm";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";
import AppLayoutGeneral from "@/components/AppLayout/General";
import ShowcaseCard from "@/components/Core/Card/ShowcaseCard";
import OrganizationProvider from "@/components/Admin/Organization/Provider";

const AdminOrganizations = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const { apiETK } = useApi().api;
  const { dialog } = useAppLayout();
  const { t } = useTranslation(["components", "common"]);
  const anchorRef = useRef(null);
  const formOrgaRootRef = useRef<FormOrganizationRootActions>();
  const [open, setOpen] = useState(false);

  const fetchRootrganizations = async () => {
    const { data } = await apiETK.get("/admin/organization/root_nodes");
    return data;
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isSuccess,
    data: organizations,
  } = useQuery<IOrganization[], AxiosError>(
    ["RootOrganizations"],
    fetchRootrganizations
  );

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const addOrganization = async (isNew) => {
    const response = await formOrgaRootRef.current.submit();
    if (response.status === 200) {
      dialog.current.close();
      queryClient.invalidateQueries("RootOrganizations");
    }
  };

  function openForm(organization?) {
    const isNew = !Boolean(organization);
    const dialogActions = [
      {
        label: t("common.buttons.cancel"),
      },
      {
        label: isNew ? t("common.buttons.create") : t("common.buttons.update"),
        variant: "contained",
        color: "primary",
        noClose: true,
        onClick: () => addOrganization(isNew),
      },
    ];

    dialog.current.open({
      title: t(`components.Team.dialogTitle${isNew ? "Create" : "Edit"}`),
      content: <FormOrganizationRoot ref={formOrgaRootRef} />,
      actions: dialogActions,
    });
  }

  useEffect(() => {
    if (!user?.is_superuser) {
      router.push("/");
    }
  }, [user]);

  if (!user) {
    return <FullPageSpinner />;
  }

  if (isLoading) {
    // TODOS Create Skeleton page component
    return <FullPageSpinner />;
  }

  if (isSuccess) {
    if (organizations.length > 0) {
      return (
        <AppLayoutGeneral>
          <OrganizationProvider>
            <Container>
              <Grid container justify="center" direction="column" spacing={2}>
                <Grid
                  item
                  xs
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-start"
                >
                  <Grid item>
                    <Typography variant="h5">
                      {t("common.pages.Admin.Organizations.title")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        openForm();
                      }}
                      size="small"
                    >
                      {t("common.pages.Admin.Organization.addRootOrganization")}
                    </Button>
                  </Grid>
                </Grid>
                <Grid xs item container spacing={2}>
                  {organizations.map((organization) => {
                    return (
                      <Grid
                        key={`${organization.id}`}
                        item
                        xs={12}
                        sm={6}
                        md={3}
                      >
                        <ShowcaseCard
                          ownerEmail={organization.current_user_role}
                          slug={organization.slug}
                          name={organization.name}
                          thumbnail={`/osm_thumbnails/thumbnail/${organization.osm_id}?organizationId=${organization.id}&width=345&height=230&padding=30`}
                          isPrivate={organization.mode == "private"}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Container>
          </OrganizationProvider>
        </AppLayoutGeneral>
      );
    }

    if (organizations.length == 0) {
      return (
        <div>
          <div>Aucune organization racine connue</div>
          <Button
            variant="contained"
            onClick={() => {
              openForm();
            }}
          >
            Ajouter une organization racine
          </Button>
        </div>
      );
    }
  }
};

export default AdminOrganizations;
