import { IOrganization } from "@/index.d";
import React, { createRef, FC, useEffect, useRef, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import Map from "@/components/Map/Map";
import ETKMap from "@/components/Map/Map";
import { apiRest } from "@/lib/api";
import { makeStyles } from "@material-ui/core/styles";
import { useTemplate } from "@/components/Template";
import ETKFormOrganization, { ETKFormOrganizationActions } from "../Form/Form";
import ETKFormWorkingArea, {
  ETKFormWorkingAreaActions,
} from "../WorkingArea/Form";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryCache } from "react-query";
import { bbox } from "@turf/turf";

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
  const { dialog, snackbar } = useTemplate();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);
  const mapRef = createRef<ETKMap>();
  const [isMapReady, setIsMapReady] = useState(false);
  const cache = useQueryCache();

  const queryName = `working_area_${organization.id}`;
  const { status, data: workingArea, error, isFetching } = useQuery(
    queryName,
    async () => {
      const data = await apiRest.organization.getWorkingArea(organization.id);

      return data;
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
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: addItem,
      },
    ];

    dialog.current.open({
      title: t(`components:Team.dialogTitleEdit`),
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
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: editWorkingArea,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.WorkingArea.dialogTitle"),
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