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
import bbox from "@turf/bbox";

const useStyles = makeStyles((theme) => ({
  map: {
    minHeight: "400px",
  },
}));

interface IGeneralInfoTab {
  organization: IOrganization;
}

const GeneralInfoTab: FC<IGeneralInfoTab> = ({ organization }) => {
  const classes = useStyles();
  const { dialog, snackbar } = useAppLayout();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);
  const mapRef = createRef<ETKMap>();
  const [workingArea, setWorkingArea] = useState({
    geometry: { coordinates: [] },
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const { apiETK } = useApi().api;

  const queryName = `working_area_${organization.id}`;

  const getWorkingArea = async () => {
    try {
      const { status, data } = await apiETK.get(
        `/organization/${organization.id}/working_area`
      );

      if (status === 200) {
        setWorkingArea(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getWorkingArea();
  }, []);

  useEffect(() => {
    if (mapRef.current && isMapReady && workingArea) {
      if (workingArea.geometry?.coordinates.length) {
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
    const response = await formEditRef.current.submit();
    const data = await response.json();

    //TODO handle errors

    dialog.current.close();
    //TODO display new data
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
      await getWorkingArea();
      snackbar.current.open({
        message: "Succès de l'envoi.",
        severity: "success",
      });
    }
  };

  return (
    <Grid container alignItems="stretch">
      <Grid item xs={6}>
        {organization?.name}
        <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              openForm();
            }}
          >
            Edit
          </Button>
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
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            openArea();
          }}
        >
          Edit map
        </Button>
      </Grid>
    </Grid>
  );
};

export default GeneralInfoTab;
