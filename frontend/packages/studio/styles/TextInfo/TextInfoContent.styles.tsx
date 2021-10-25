export default ({ palette, spacing }) => {
  return {
    overline: {
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontSize: 12,
      marginBottom: "0.875em",
      display: "inline-block",
    },
    heading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: "0.35em",
    },
    body: {
      marginBottom: spacing(2),
      fontSize: "0.8rem",
      letterSpacing: "0.00938em",
    },
    button: {
      backgroundImage: `linear-gradient(147deg, ${palette.primary.main} 0%, #08b699 74%)`,
      boxShadow: "0px 4px 32px rgba(5, 49, 42, 0.4)",
      borderRadius: 100,
      paddingLeft: 24,
      paddingRight: 24,
      color: "#ffffff",
    },
  };
};
