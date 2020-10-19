import React, { useEffect, useState } from "react";
import { Card, CardMedia, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  media: {
    height: 240,
  },
});

async function getInformationByProp(prop, genre) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=${prop}&titles=${genre}&formatversion=2&origin=*&format=json`;
  const response = await fetch(url);
  const json = await response.json();

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

export default function Wikipedia(props) {
  const classes = useStyles();
  const [genre, setGenre] = useState(props.genre);
  const [data, setData] = useState({ image: null, html: null });

  useEffect(() => {
    setGenre(props.genre);

    (async (genre) => {
      if (!genre) {
        setData({ image: null, html: null });
        return;
      }
      const html = await getInformationByProp("extracts", genre);
      let image = null;

      if (html) {
        image = await getInformationByProp("pageimages", genre);
      }

      setData({
        image,
        html,
      });
    })(props.genre);
  }, [props.genre]);

  return genre ? (
    <Card elevation={0}>
      {data.image && <CardMedia className={classes.media} image={data.image} />}
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: data.html }}></div>
      </CardContent>
    </Card>
  ) : (
    <div>No genre</div>
  );
}
