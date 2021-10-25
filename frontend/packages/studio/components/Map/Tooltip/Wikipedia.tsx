import { FC } from "react";
import { makeStyles, Button, Theme } from "@material-ui/core";

export interface MapTooltipWikipediaProps {
  properties: Record<string, string>;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MapTooltipWikipedia: FC<MapTooltipWikipediaProps> = ({ properties }) => {
  const classes = useStyles();

  return (
    <div>
      {properties.species && (
        <Button fullWidth variant="contained" color="primary">
          View more info on wikipedia
        </Button>
      )}
      {!properties.species && (
        <Button fullWidth variant="contained" color="primary">
          aidez nous à completer la donnée
        </Button>
      )}
    </div>
  );
};

export default MapTooltipWikipedia;
