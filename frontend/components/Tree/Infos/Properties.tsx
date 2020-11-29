import React from "react";
import {
  makeStyles,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@material-ui/core";

export interface TreeInfosPropertiesProps {
  tree: {
    id: number;
    x: number;
    y: number;
    properties: object;
  };
}

const defaultProps: TreeInfosPropertiesProps = {
  tree: undefined,
};

const useStyles = makeStyles(() => ({
  container: { maxHeight: 220 },
}));

const TreeInfosProperties: React.FC<TreeInfosPropertiesProps> = (props) => {
  const classes = useStyles();

  return props.tree ? (
    <TableContainer component={Paper} className={classes.container}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>Lat</TableCell>
            <TableCell>{props.tree.x}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Lng</TableCell>
            <TableCell>{props.tree.y}</TableCell>
          </TableRow>
          {props.tree.properties &&
            Object.keys(props.tree.properties).map((key) => (
              <TableRow key={`psti-${key}`}>
                <TableCell>{key}</TableCell>
                <TableCell>{props.tree.properties[key]}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

TreeInfosProperties.defaultProps = defaultProps;

export default TreeInfosProperties;
