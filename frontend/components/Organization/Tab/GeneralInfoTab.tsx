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
  const [workingArea, setWorkingArea] = useState({
    geometry: { coordinates: [] },
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const { apiETK } = useApi().api;
  const [organization, setOrganization] = useState<IOrganization>(
    initialOrganization
  );
  const [workingArea, setWorkingArea] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getWorkingArea = async (organization) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organization.id}/working_area`
      );
      if (status == 200) {
        enqueueSnackbar(
          `${t("components.Organization.WorkingArea.getSuccess")}`,
          {
            variant: "success",
          }
        );
        setWorkingArea(data);
      }
    } catch (error) {
      enqueueSnackbar(
        `${t("components.Organization.WorkingArea.getFailure")}`,
        {
          variant: "error",
        }
      );
      setWorkingArea(null);
    }
  };

      if (status === 200) {
        setWorkingArea(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    setOrganization(initialOrganization);
    getWorkingArea(initialOrganization);
  }, [initialOrganization]);

  useEffect(() => {
    if (mapRef.current && isMapReady && workingArea) {
      if (workingArea.geometry?.coordinates.length) {
        const map = mapRef.current.map;
        map.fitBounds(bbox(workingArea.geometry));
        if (map.getSource("waSource")) {
          map.removeLayer("waSource");
          map.removeSource("waSource");
        }
        map.addSource("waSource", {
          type: "geojson",
          data: workingArea,
        });
        map.addLayer({
          id: "waSource",
          source: "waSource",
          type: "fill",
          paint: {
            "fill-color": "#00C6B8",
            "fill-opacity": 0.5,
          },
        });
      }
    }
    if (mapRef.current && isMapReady && !workingArea) {
      const map = mapRef.current.map;
      if (map.getSource("waSource")) {
        map.removeLayer("waSource");
        map.removeSource("waSource");
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
        onClick: addItem,
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
    try {
      const isOk = await formAreaRef.current.submit();
      if (isOk) {
        getWorkingArea(organization);
        enqueueSnackbar(`${t("components.Organization.crud.success")}`, {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(`${t("components.Organization.crud.failure")}`, {
        variant: "error",
      });
    } finally {
      dialog.current.close();
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
