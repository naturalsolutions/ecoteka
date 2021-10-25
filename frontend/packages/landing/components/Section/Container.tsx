import { FC } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";

export interface SectionContainerProps {
  title: string;
}

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: 60,
  },
}));

const SectionContainer: FC<SectionContainerProps> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <>
      <Typography component="h3" variant="h2">
        {title}
      </Typography>
      <Grid container className={classes.container} spacing={2}>
        {children}
      </Grid>
    </>
  );
};

export default SectionContainer;
