import { FC } from "react";
import { Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  logo: {
    zIndex: 2,
    display: "block",
    position: "absolute",
    top: 18,
    background: `no-repeat center url('./logo-short.svg')`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    height: "40px",
    width: "40px",
    "&:hover": {
      textDecoration: "none",
    },
    [theme.breakpoints.up("md")]: {
      position: "unset",
      top: "unset",
      background: `no-repeat center url('./logo.svg')`,
      width: "210px",
    },
  },
}));

const Logo: FC = () => {
  const classes = useStyles();

  return (
    <Link className={classes.logo} href="/">
      {"\u00A0"}
    </Link>
  );
};

export default Logo;
