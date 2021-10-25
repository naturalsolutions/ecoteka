import { FC } from "react";
import { Grid, makeStyles, Theme } from "@material-ui/core";

export interface KeysImageProps {
  src: string;
  alt: string;
}

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  root: {
    textAlign: "center",
  },
  img: {
    width: "100%",
    marginBottom: 30,
    [theme.breakpoints.up("sm")]: {
      marginBottom: "auto",
      width: "80%",
    },
  },
}));

const KeysImage: FC<KeysImageProps> = ({ src, alt }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={4} className={classes.root}>
      <img className={classes.img} src={src} alt={alt} />
    </Grid>
  );
};

export default KeysImage;
