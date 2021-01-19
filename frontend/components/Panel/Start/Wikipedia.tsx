import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  media: {
    height: 240,
  },
});

async function getInformationByProp(prop, genre) {
  let url = `https://fr.wikipedia.org/w/api.php?action=query&prop=${prop}&titles=${genre}&formatversion=2&origin=*&format=json`;
  let response = await fetch(url);
  let json = await response.json();

  if (json.warnings) {
    url = `https://en.wikipedia.org/w/api.php?action=query&prop=${prop}&titles=${genre}&formatversion=2&origin=*&format=json`;
    response = await fetch(url);
    json = await response.json();
  }

  if (prop === "extracts" && json.hasOwnProperty("query")) {
    return json.query.pages.pop().extract;
  }

  if (prop === "pageimages" && json.hasOwnProperty("query")) {
    const width = 240;

    if (json.query.pages && json.query.pages.length) {
      let image = json.query.pages.pop();

      if (image && image.thumbnail)
        return image.thumbnail.source.replace(/\/\d\dpx-/, `/${width}px-`);
    }
  }
}

const initalData = async (query) => {
  const data = { image: null, html: null };

  data.html = await getInformationByProp("extracts", query);

  if (data.html) {
    data.image = await getInformationByProp("pageimages", query);
  }

  return data;
};

export default function Wikipedia(props) {
  const classes = useStyles();
  const [data, setData] = useState({ html: null, image: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    initalData(props.genre).then((newData) => {
      setData(newData);
      setLoading(false);
    });
  }, [props.genre]);

  return props.genre ? (
    loading ? (
      <Grid container>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    ) : (
      <Card elevation={0}>
        {data.image && (
          <CardMedia className={classes.media} image={data.image} />
        )}
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: data.html }}></div>
        </CardContent>
      </Card>
    )
  ) : null;
}
