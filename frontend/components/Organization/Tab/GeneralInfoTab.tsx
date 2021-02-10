import { IOrganization } from "@/index.d";
import React, { createRef, FC, useEffect, useRef, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import Map from "@/components/Map/Map";
import ETKMap from "@/components/Map/Map";
import useApi from "@/lib/useApi";
import { makeStyles } from "@material-ui/core/styles";
import { useAppLayout } from "@/components/AppLayout/Base";
import ETKFormOrganization, {
  ETKFormOrganizationActions,
} from "@/components/Organization/Form/Form";
import ETKFormWorkingArea, {
  ETKFormWorkingAreaActions,
} from "@/components/Organization/WorkingArea/Form";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryCache } from "react-query";
import bbox from "@turf/bbox";
import { useSnackbar } from "notistack";
import Can from "@/components/Can";

const useStyles = makeStyles((theme) => ({
  map: {
    minHeight: "400px",
  },
}));

interface IGeneralInfoTab {
  organization: IOrganization;
}

const GeneralInfoTab: FC<IGeneralInfoTab> = ({
  organization: initialOrganization,
}) => {
  const classes = useStyles();
  const { dialog, snackbar } = useAppLayout();
  const { t } = useTranslation(["components", "common"]);
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const mapRef = createRef<ETKMap>();
  const [isMapReady, setIsMapReady] = useState(false);
  const { apiETK } = useApi().api;
  const [organization, setOrganization] = useState<IOrganization>(
    initialOrganization
  );
  const { enqueueSnackbar } = useSnackbar();

  // TODO: deprecate useQuery usage
  const queryName = `working_area_${organization.id}`;
  const cache = useQueryCache();
  const { status, data: workingArea, error, isFetching } = useQuery(
    queryName,
    async () => {
      try {
        const { data } = await apiETK.get(
          `/organization/${organization.id}/working_area`
        );

        return data;
      } catch (error) {}
    },
    {
      enabled: Boolean(organization),
    }
  );

  useEffect(() => {
    if (mapRef.current && isMapReady && workingArea) {
      if (workingArea.geometry) {
        const map = mapRef.current.map;
        map.fitBounds(bbox(workingArea.geometry));
        if (map.getSource(queryName)) {
          map.removeLayer(queryName);
          map.removeSource(queryName);
        }
        map.addSource(queryName, {
          type: "geojson",
          data: workingArea,
        });
        map.addLayer({
          id: queryName,
          source: queryName,
          type: "fill",
          paint: {
            "fill-color": "#00C6B8",
            "fill-opacity": 0.5,
          },
        });
      }
    }
  }, [mapRef, workingArea]);

  function openForm() {
    const dialogActions = [
      {
        label: t("common.buttons.cancel"),
      },
      {
        label: t("common.buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: addItem,
      },
    ];

    dialog.current.open({
      title: t(`components.Team.dialogTitleEdit`),
      content: (
        <ETKFormOrganization ref={formEditRef} organization={organization} />
      ),
      actions: dialogActions,
    });
  }

  const addItem = async () => {
    try {
      const { status, data } = await formEditRef.current.submit();
      if (status === 200) {
        enqueueSnackbar(`${t("components.Organization.crud.success")}`, {
          variant: "success",
        });
        setOrganization(data);
      }
    } catch (error) {
      enqueueSnackbar(`${t("components.Organization.crud.failure")}`, {
        variant: "error",
      });
    } finally {
      dialog.current.close();
    }
  };

  function openArea() {
    const dialogActions = [
      {
        label: t("common.buttons.cancel"),
      },
      {
        label: t("common.buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: editWorkingArea,
      },
    ];

    dialog.current.open({
      title: t("components.Organization.WorkingArea.dialogTitle"),
      content: (
        <ETKFormWorkingArea ref={formAreaRef} organization={organization} />
      ),
      actions: dialogActions,
    });
  }

  const editWorkingArea = async () => {
    const isOk = await formAreaRef.current.submit();
    if (isOk) {
      dialog.current.close();
      snackbar.current.open({
        message: "Succès de l'envoi.",
        severity: "success",
      });
      cache.invalidateQueries(queryName);
    }
  };

  return (
    <Grid container alignItems="stretch">
      <Grid item xs={6}>
        {organization.name}
        <div>
          <Can do="update" on="Organization">
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                openForm();
              }}
            >
              Edit
            </Button>
          </Can>
        </div>
      </Grid>
      <Grid item xs={6} className={classes.map}>
        <Map
          styleSource="/assets/base.json"
          ref={mapRef}
          onStyleData={() => {
            setIsMapReady(true);
          }}
        />
        <Can do="update" on="Organization">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              openArea();
            }}
          >
            Edit map
          </Button>
        </Can>
      </Grid>
    </Grid>
  );
};

export default GeneralInfoTab;
