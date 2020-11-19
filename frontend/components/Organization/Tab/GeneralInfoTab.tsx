import { TOrganization } from "@/pages/organization/[id]";
import React, { FC } from "react";
import { Grid, Box } from "@material-ui/core";
import Map from "@/components/Map/Map";
import { apiRest } from "@/lib/api";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  map: {
    minHeight: "400px",
  },
}));

interface IGeneralInfoTab {
  organization: TOrganization;
}

const GeneralInfoTab: FC<IGeneralInfoTab> = ({ organization }) => {
  const classes = useStyles();

  return (
    <Grid container alignItems="stretch">
      <Grid item xs={6}>
        {organization.name}
      </Grid>
      <Grid item xs={6} className={classes.map}>
        <Map styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`} />
      </Grid>
    </Grid>
  );
};

export default GeneralInfoTab;
