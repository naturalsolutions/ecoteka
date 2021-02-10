import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Grid,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Wikipedia from "@/components/Panel/Start/Wikipedia";
import { useRouter } from "next/router";

export interface PanelStartTreeInfoProps {
  tree: any;
  onClose?(): void;
}

const defaultProps: PanelStartTreeInfoProps = {
  tree: {},
};

const useStyles = makeStyles(() => ({
  root: {
    width: "25rem",
    height: "100%",
  },
}));

interface Tree {
  gender: string;
}

const PanelStartTreeInfo: React.FC<PanelStartTreeInfoProps> = (props) => {
  const classes = useStyles();
  const [properties, setProperties] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (props.tree.other_tags) {
      try {
        let newProperties = JSON.parse(
          `{${props.tree.other_tags.replaceAll("=>", ":")}}`
        );

        setProperties({
          osm_id: props.tree.osm_id,
          ...newProperties,
        });
      } catch (e) {}
    } else {
      setProperties(props.tree);
    }
  }, [props.tree]);

  return (
    <Grid container className={classes.root} direction="column" spacing={2}>
      <Grid item>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h6">Info</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                router.push("/?panel=start");
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableBody>
              {Object.keys(properties).map((key) => (
                <TableRow key={`psti-${key}`}>
                  <TableCell>{key}</TableCell>
                  <TableCell align="right">{properties[key]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item>
        <Wikipedia
          genre={
            properties.gender ||
            properties["genus:fr"] ||
            properties["taxon:species"] ||
            properties["species:fr"]
          }
        />
      </Grid>
    </Grid>
  );
};

PanelStartTreeInfo.defaultProps = defaultProps;

export default PanelStartTreeInfo;
