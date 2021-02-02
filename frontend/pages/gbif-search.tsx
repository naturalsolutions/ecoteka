import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Nature as NatureIcon, Link as LinkIcon } from "@material-ui/icons";
import useAPI from "@/lib/useApi";
import AppLayoutGeneral from "@/components/AppLayout/General";

export interface ETKGBIFSearchProps {}

const defaultProps: ETKGBIFSearchProps = {};

const ETKGBIFSearch: React.FC<ETKGBIFSearchProps> = (props) => {
  const { api } = useAPI();
  const { apiETK: ecotekaV1, apiGBIF } = api;
  const [query, setQuery] = useState("");
  const [taxa, setTaxa] = useState([]);
  const getUsers = async () => {
    const res = await ecotekaV1.get("users");
    return res;
  };
  const speciesSearch = async (query) => {
    // GET all Tracheophyta from GBIF Backbone Taxonomy
    const res = await apiGBIF.get(
      `/species/search?q=${query}&rank=species&highertaxonKey=7707728&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`
    );
    return res;
  };

  const speciesMedia = async (key) => {
    const res = await apiGBIF.get(`/species/${key}/media`);
    return res;
  };
  const speciesVernacularNames = async (key) => {
    const res = await apiGBIF.get(`/species/${key}/vernacularNames`);
    return res;
  };

  useEffect(() => {
    /// To useAPI() auth refresh
    getUsers();
  }, []);

  useEffect(() => {
    speciesSearch(query).then((res) => {
      setTaxa(res.data?.results);
      // TODO : Limit results, use debounced query, aggregate media and vernacularNames in results
    });
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <AppLayoutGeneral>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box p={4}>
            <Paper elevation={3}>
              <Box p={4}>
                <Typography variant="h6" style={{ marginBottom: "1.5rem" }}>
                  ⚙ Search inpüt- useDebouñce()
                </Typography>
                <TextField
                  label="Recherche"
                  placeholder="Rechercher des plantes sur GBIF"
                  variant="outlined"
                  value={query}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                  }}
                />
                <List style={{ maxHeight: "66vh", overflow: "auto" }}>
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
                          <ListItemSecondaryAction>
                            <IconButton
                              href={`https://www.gbif.org/species/${taxon.key}`}
                              target="_blank"
                              edge="end"
                              aria-label="delete"
                            >
                              <LinkIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                </List>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box p={4}>
            <Paper elevation={3}>
              <Box p={4}>
                <Typography variant="h6" style={{ marginBottom: "1.5rem" }}>
                  ⚙ Search inpüt- useAutocomplete()
                </Typography>
                <TextField
                  label="Autocomplete"
                  placeholder="Rechercher des plantes sur GBIF"
                  variant="outlined"
                  value={query}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </AppLayoutGeneral>
  );
};

ETKGBIFSearch.defaultProps = defaultProps;

export default ETKGBIFSearch;
