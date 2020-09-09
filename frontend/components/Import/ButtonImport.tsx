import React from "react";
import { Button } from "@material-ui/core";
import { apiRest } from "../../lib/api";

export interface ETKButtonImportProps {
  name: string;
  onImported(): void;
  buttonImportContent?: string;
}

const defaultProps: ETKButtonImportProps = {
  name: "",
  onImported: () => {},
  buttonImportContent: "IMPORTER",
};

const ETKButtonImport: React.FC<ETKButtonImportProps> = (props) => {
  const onImport = async () => {
    const response = await apiRest.trees.importFromGeofile(props.name);

    if (response.status === "importing") {
      setTimeout(() => {
        onImport();
      }, 5000);
    }

    props.onImported();
  };

  return (
    <Button variant="contained" color="primary" onClick={onImport}>
      {props.buttonImportContent}
    </Button>
  );
};

ETKButtonImport.defaultProps = defaultProps;

export default ETKButtonImport;
