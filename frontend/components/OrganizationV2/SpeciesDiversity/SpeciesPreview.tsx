import { FC, useEffect, useState } from "react";
import { Avatar, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useApi from "@/lib/useApi";

export interface SpeciesPreviewProps {
  canonicalName: string;
  total: number;
  ratio: number;
  isMini: boolean;
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
}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);
  const { apiEOL, apiWikispecies } = useApi().api;
  const [scName, setScName] = useState<string>(undefined);
  const [speciesThumbnail, setSpeciesThumbnail] = useState<string>(undefined);

  const searchSpecies = async (canonicalName: string) => {
    try {
      const { data, status } = await apiEOL.get(
        `/search/1.0.json?q=${canonicalName}`
      );
      if (status === 200) {
        if (data.results.length > 0) {
          getSpecies(data.results[0].id);
        }
      }
    } catch ({ response, request }) {
      if (response) {
        // console.log(response);
      }
    }
  };

  const setSpeciesThumbnailWithWikispecies = async (
    formattedCanonicalName: string
  ) => {
    try {
      const { data, status } = await apiWikispecies.get(
        `/page/summary/${formattedCanonicalName}`
      );
      if (status === 200) {
        if (data.thumbnail.source) {
          setSpeciesThumbnail(data.thumbnail.source);
        }
      }
    } catch ({ response, request }) {
      if (response) {
        // console.log(response);
      }
    }
  };

  const getSpecies = async (id: number) => {
    try {
      const { data, status } = await apiEOL.get(
        `/pages/1.0/${id}.json?details=true&images_per_page=10`
      );
      if (status === 200) {
        if (data.taxonConcept) {
          setScName(data.taxonConcept.scientificName);
          data.taxonConcept.dataObjects?.length > 0
            ? setSpeciesThumbnail(data.taxonConcept.dataObjects[0].eolMediaURL)
            : setSpeciesThumbnailWithWikispecies(
                canonicalName.replace(" ", "_")
              );
        }
      }
    } catch ({ response, request }) {
      if (response) {
        // console.log(response);
      }
    }
  };

  useEffect(() => {
    searchSpecies(canonicalName);
  }, [canonicalName]);

  return (
    <Grid
      item
      container
      direction={isMini ? "row" : "column"}
      justify={isMini ? "space-between" : "center"}
      alignItems="center"
      spacing={1}
      md={isMini ? 12 : 2}
      sm={isMini ? 12 : 4}
    >
      <Grid item>
        <Avatar alt={scName} src={speciesThumbnail} className={classes.large}>
          {scName ? scName.charAt(0) : "."}
        </Avatar>
      </Grid>
      <Grid item xs>
        <Typography variant="body2" gutterBottom>
          <i>
            {canonicalName.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
          </i>
        </Typography>
      </Grid>
      <Grid item>{(ratio * 100).toFixed(2)} %</Grid>
    </Grid>
  );
};

export default SpeciesPreview;
