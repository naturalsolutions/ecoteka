export default function themeStyle(theme = "light") {
  const headerStyles = {
    padding: 0,
    height: "50px",
    lineHeight: "50px",
  };

  const style = {
    dark: {
      header: {
        background: "#161616",
        ...headerStyles,
      },

      circlePaint: {
        "circle-radius": {
          base: 1.75,
          stops: [
            [12, 2],
            [22, 180],
          ],
        },
        "circle-color": [
          "match",
          ["get", "genre"],
          "Celtis",
          "#63b598",
          "Platanus",
          "#659B5E",
          "Pinus",
          "#556F44",
          "Olea",
          "#8FAD88",
          "Malus",
          "#B9F18C",
          "Liquidambar",
          "#04724D",
          "Autre",
          "#8DB38B",
          "Cupressus",
          "#56876D",
          "Magnolia",
          "#4E6E58",
          "Cedrus",
          "#77AD78",
          "Quercus",
          "#6F8F72",
          "Catalpa",
          "#8FD694",
          "Acer",
          "#7DBA84",
          "#6F8F72",
        ],
      },
    },

    light: {
      header: {
        background: "#fff",
        ...headerStyles,
      },

      circlePaint: {
        "circle-radius": {
          base: 1.75,
          stops: [
            [12, 2],
            [22, 180],
          ],
        },
        "circle-color": [
          "match",
          ["get", "genre"],
          "Celtis",
          "#63b598",
          "Platanus",
          "#659B5E",
          "Pinus",
          "#556F44",
          "Olea",
          "#8FAD88",
          "Malus",
          "#B9F18C",
          "Liquidambar",
          "#04724D",
          "Autre",
          "#8DB38B",
          "Cupressus",
          "#56876D",
          "Magnolia",
          "#4E6E58",
          "Cedrus",
          "#77AD78",
          "Quercus",
          "#6F8F72",
          "Catalpa",
          "#8FD694",
          "Acer",
          "#7DBA84",
          "#6F8F72",
        ],
      },
    },
  };

  return style[theme];
}
