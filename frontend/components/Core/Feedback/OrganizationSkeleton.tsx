import { makeStyles, Container, Grid, Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({}));

const OrganizationSkeleton = (props) => {
  const styles = useStyles();
  return (
    <Container>
      <Grid container direction="column">
        <Grid item>
          <Skeleton variant="rect" width={"100%"} height={500} />
        </Grid>
        <Grid item>
          <Box my={2} />
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rect" width={"100%"} height={300} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rect" width={"100%"} height={300} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrganizationSkeleton;
