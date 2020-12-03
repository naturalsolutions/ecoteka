import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Nature as NatureIcon } from "@material-ui/icons";
import useAPI from "@/lib/useApi";

export interface ETKSandboxProps {}

const defaultProps: ETKSandboxProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKGBIFSearch: React.FC<ETKGBIFSearchProps> = (props) => {
  const classes = useStyles();
  const { ecotekaV1, gbif } = useAPI();
  const [query, setQuery] = useState("");
  const [taxa, setTaxa] = useState([]);
  const getUsers = async () => {
    const res = await ecotekaV1.get("users");
    return res;
  };
  const speciesSearch = async (query) => {
    const res = await gbif.get(
      `/species/search?q=${query}&rank=species&highertaxonKey=7707728&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`
    );
    return res;
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    speciesSearch(query).then((res) => {
      console.log(res);
      setTaxa(res.data?.results);
    });
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <Box
      flexDirection="row"
      p={6}
      alignItems="center"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box>
        <TextField
          label="Recherche"
          placeholder="Rechercher des plantes sur GBIF"
          variant="outlined"
          value={query}
          onChange={handleChange}
          style={{
            width: "66%",
          }}
        />
        <List>
          {taxa.length > 0 &&
            taxa.map((taxon) => {
              return (
                <ListItem key={taxon.key}>
                  <ListItemAvatar>
                    <Avatar>
                      <NatureIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={taxon.canonicalName}
                    secondary={taxon.family}
                  />
                </ListItem>
              );
            })}
        </List>
      </Box>
    </Box>
  );
};

ETKGBIFSearch.defaultProps = defaultProps;

export default ETKGBIFSearch;
