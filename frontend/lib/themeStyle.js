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
    },

    light: {
      header: {
        background: "#fff",
        ...headerStyles,
      },
    },
  };

  return style[theme];
}
