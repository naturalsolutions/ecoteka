import { FC } from "react";
import Link, { LinkProps } from "next/link";
import { Grid, makeStyles } from "@material-ui/core";

export interface MenuItemProps extends LinkProps {
  label: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "3rem",
    "& > a": {
      letterSpacing: ".03rem",
      fontWeight: "bold",
      "-webkit-transition": "color .3s ease-in-out, background .3s ease-in-out",
      transition: "color .3s ease-in-out, background .3s ease-in-out",
      fontSize: "2.5rem",
      color: "#3eb7b1",
    },
    "& > a:hover": {
      color: "#1d7065",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: "0",
      "&:not(:first-child)": {
        marginLeft: "2rem",
      },
      "& > a" :{
        fontSize: "1rem",
      }
    },
  },
}));

const MenuItem: FC<MenuItemProps> = ({ href, label }) => {
  const classes = useStyles();

  return (
    <Grid item component="li" className={classes.root}>
      <Link href={href}>{label}</Link>
    </Grid>
  );
};

export default MenuItem;
