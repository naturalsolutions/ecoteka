import React, { FC, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import MapGL from "@urbica/react-map-gl";
import { Grid, InputBase, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";

export interface IMapFilter {
  map: MapGL;
  handleFilter: (query: string) => void;
  filterQuery;
}

const useStyles = makeStyles(
  ({ direction, spacing, transitions, breakpoints, palette, shape }) => {
    return {
      search: {
        position: "relative",
        marginRight: 8,
        borderRadius: shape.borderRadius,
        background:
          palette.type === "dark"
            ? palette.background.default
            : palette.grey[200],
        "&:hover": {
          background:
            palette.type === "dark"
              ? palette.background.paper
              : palette.grey[300],
        },
        marginLeft: 0,
        width: "100%",
        [breakpoints.up("sm")]: {
          marginLeft: spacing(1),
          width: "auto",
        },
      },
      searchIconWrapper: {
        width: spacing(6),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      searchIcon: {
        color: palette.text.primary,
      },
      inputRoot: {
        color: palette.text.primary,
        width: "100%",
      },
      inputInput: {
        borderRadius: 4,
        paddingTop: spacing(1),
        paddingRight: spacing(direction === "rtl" ? 5 : 1),
        paddingBottom: spacing(1),
        paddingLeft: spacing(direction === "rtl" ? 1 : 5),
        transition: transitions.create("width"),
        width: "100%",
        [breakpoints.up("sm")]: {
          width: 300,
        },
      },
    };
  }
);

const MapFilter: FC<IMapFilter> = ({ map, handleFilter, filterQuery }) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const [query, setQuery] = useState(filterQuery);

  const handleChange = (event) => {
    setQuery(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Grid item>
          <div className={classes.search}>
            <div className={classes.searchIconWrapper}>
              <Search className={classes.searchIcon} />
            </div>
            <InputBase
              placeholder="Nom commun ou scientifique de l'arbre"
              value={query}
              onChange={handleChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(MapFilter);
