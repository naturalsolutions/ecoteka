import { FC } from "react";
import { Avatar, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface SpeciesPreviewProps {
  canonicalName: string;
  ratio: number;
  isMini: boolean;
  thumbnail: string;
  // scientificName : string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  textCenter: {
    textAlign: "center",
  },
}));

const SpeciesPreview: FC<SpeciesPreviewProps> = ({
  canonicalName,
  ratio,
  isMini,
  thumbnail,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);

  return (
    <Grid
      item
      container
      direction={isMini ? "row" : "column"}
      justifyContent={isMini ? "space-between" : "center"}
      alignItems="center"
      spacing={1}
      md={isMini ? 12 : 2}
      sm={isMini ? 12 : 4}
    >
      <Grid item>
        <Avatar alt={canonicalName} src={thumbnail} className={classes.large}>
          {/* {scName ? scName.charAt(0) : "."} */}
        </Avatar>
      </Grid>
      <Grid item xs>
        <Typography variant="body2" gutterBottom>
          <i>
            {canonicalName
              .replace("‹", "i")
              .toLowerCase()
              .replace(/^\w/, (c) => c.toUpperCase())}
          </i>
        </Typography>
      </Grid>
      <Grid item>{(ratio * 100).toFixed(2)} %</Grid>
    </Grid>
  );
};

export default SpeciesPreview;
