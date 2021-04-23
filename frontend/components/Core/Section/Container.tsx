import { FC } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";

export interface SectionContainerProps {
  title: string;
}

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 20,
  },
  container: {
    marginBottom: 60,
  },
}));

const SectionContainer: FC<SectionContainerProps> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h3" className={classes.title} color="textPrimary">
        {title}
      </Typography>
      <Grid container className={classes.container} spacing={2}>
        {children}
      </Grid>
    </>
  );
};

export default SectionContainer;
