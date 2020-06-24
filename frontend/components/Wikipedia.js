import { useEffect, useState } from "react";
import { Empty, Panel } from "antd";

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
      return json.query.pages
        .pop()
        .thumbnail.source.replace(/\/\d\dpx-/, `/${width}px-`);
    }
  }
}

export default function Wikipedia(props) {
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
    })(genre);
  }, [props]);

  return genre ? (
    <div
      style={{
        position: "absolute",
        marginTop: "38px",
        boxSizing: "border-box",
        left: 0,
        top: 0,
        height: "calc(100% - 38px)",
        width: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        padding: "1rem",
      }}
    >
      <img src={data.image} />
      <div dangerouslySetInnerHTML={{ __html: data.html }}></div>
    </div>
  ) : (
    <Empty />
  );
}
