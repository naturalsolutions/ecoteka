import { IOrganization } from "@/index.d"
import React, { FC, useRef } from "react";
import { Grid, Box, Button } from "@material-ui/core";
import Map from "@/components/Map/Map";
import { apiRest } from "@/lib/api";
import { makeStyles } from "@material-ui/core/styles";
import { useTemplate } from "@/components/Template";
import ETKFormOrganization, { ETKFormOrganizationActions } from "../Form/Form";
import ETKFormWorkingArea, { ETKFormWorkingAreaActions } from "../WorkingArea/Form";
import { useTranslation } from "react-i18next";

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
  const { dialog, theme } = useTemplate();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);

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
      content: <ETKFormOrganization ref={formEditRef} organization={organization} />,
      actions: dialogActions
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
      content: <ETKFormWorkingArea ref={formAreaRef} organization={organization} />,
      actions: dialogActions
    });
  }

  const editWorkingArea = async () => {
    const isOk = await formAreaRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO update map
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
            }}>
            Edit
          </Button>
        </div>
      </Grid>
      <Grid item xs={6} className={classes.map}>
        <Map styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`} />
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            openArea();
          }}>
          Edit map
        </Button>
      </Grid>
    </Grid>
  );
};

export default GeneralInfoTab;
