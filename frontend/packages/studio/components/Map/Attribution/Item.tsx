import { FC } from "react";
import { makeStyles } from "@material-ui/core";

export interface MapAttributionItemProps {
  href: string;
  label: string;
}

const useStyles = makeStyles(() => ({
  root: {
    color: "rgba(0, 0, 0, 0.75)",
    textDecoration: "none",

    "& :hover": {
      textDecoration: "underline",
    },
  },
}));

const MapAttributionItem: FC<MapAttributionItemProps> = ({ href, label }) => {
  const classes = useStyles();

  return (
    <a className={classes.root} href={href} target="_blank">
      {label}
    </a>
  );
};

export default MapAttributionItem;
