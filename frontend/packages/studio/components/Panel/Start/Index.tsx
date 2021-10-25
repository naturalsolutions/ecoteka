import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { PanelProps } from "@/components/Panel";
import PanelStartGeneralInfo from "@/components/Panel/Start/GeneralInfo";
import PanelStartTreeInfo from "@/components/Panel/Start/TreeInfo";
import Welcome from "@/components/Panel/Start/Welcome";
import { useAppContext } from "@/providers/AppContext";

const ETKPanelStartPanel: React.FC<PanelProps> = ({ info }) => {
  const { user } = useAppContext();

  return (
    <Grid container direction="column" spacing={3}>
      {!user && !info && (
        <Grid item>
          <Welcome />
        </Grid>
      )}
      {user && !info && (
        <Grid item>
          <PanelStartGeneralInfo />
        </Grid>
      )}
      {info && (
        <Grid item>
          <PanelStartTreeInfo tree={info} />
        </Grid>
      )}
    </Grid>
  );
};

export default ETKPanelStartPanel;
