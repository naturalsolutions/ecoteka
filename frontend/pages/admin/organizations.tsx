import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import useApi from "@/lib/useApi";
import { IOrganization } from "@/index";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import FormOrganizationRoot, {
  FormOrganizationRootActions,
} from "@/components/Admin/RootOrganization/Form/Form";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";
import AppLayoutGeneral from "@/components/AppLayout/General";
import ShowcaseCard from "@/components/Core/Card/ShowcaseCard";

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

  const { isLoading, isSuccess, data: organizations } = useQuery<
    IOrganization[],
    AxiosError
  >(["RootOrganizations"], fetchRootrganizations);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const addOrganization = async (isNew) => {
    const {
      data: organizationData,
      status,
    } = await formOrgaRootRef.current.submit();
    if (status === 200) {
      dialog.current.close();
      console.log(organizationData);
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
                    <Grid key={`${organization.id}`} item xs={12} sm={6} md={3}>
                      <ShowcaseCard
                        ownerEmail={organization.current_user_role}
                        slug={organization.slug}
                        name={organization.name}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Container>
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
