import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import { ETKTree, ETKDialog } from "@/ETKC";
import { apiRest } from "@/lib/api";

const initialTree: ETKTree = {
  id: null,
  scientific_name: "",
  x: 0,
  y: 0,
};

export interface ETKSidebarAddTreeProps {
  map: any;
  titleText?: string;
  addText?: string;
  updateText?: string;
  deleteText?: string;
  scientificNameText?: string;
  latitudeText?: string;
  longitudeText?: string;
  initialTree?: ETKTree;
}

const defaultProps: ETKSidebarAddTreeProps = {
  map: null,
  titleText: "Add tree",
  addText: "Add",
  updateText: "Update",
  deleteText: "Delete",
  scientificNameText: "Scientific Name",
  latitudeText: "Latitude",
  longitudeText: "Longitude",
  initialTree: initialTree,
};

const useStyles = makeStyles(() => ({
  root: {
    width: "25rem",
    padding: "1rem",
  },
}));

const ETKSidebarAddTree: React.FC<ETKSidebarAddTreeProps> = (props) => {
  const classes = useStyles();
  const dialogRef = useRef(null);
  const [currentTree, setCurrentTree] = useState<ETKTree>(props.initialTree);
  const [isNotValid, setIsNotValid] = useState<boolean>(false);
  const [trees, setTrees] = useState<ETKTree[]>([]);

  useEffect(() => {
    setIsNotValid(true);

    if (
      !Object.is(currentTree, initialTree) &&
      currentTree.scientific_name.length > 0
    ) {
      setIsNotValid(false);
    }
  }, [currentTree]);

  const renderTextField = (label, property, type: string = "text") => (
    <TextField
      name={property}
      value={currentTree[property]}
      variant="filled"
      margin="dense"
      type={type}
      InputProps={{
        disableUnderline: true,
      }}
      label={label}
      fullWidth
      onChange={(e) => {
        setCurrentTree({ ...currentTree, [property]: e.target.value });
      }}
    />
  );

  const renderControlButton = (label, action, primary: boolean = true) => (
    <Grid item>
      <Button
        variant="contained"
        disableElevation
        disabled={isNotValid}
        color={primary ? "primary" : "default"}
        onClick={(e) => action(currentTree.id)}
      >
        {label}
      </Button>
    </Grid>
  );

  const renderControls = () => {
    return currentTree.id ? (
      <React.Fragment>
        {renderControlButton(props.deleteText, onDeleteTree, false)}
        {renderControlButton(props.updateText, onUpdateTree)}
      </React.Fragment>
    ) : (
      renderControlButton(props.addText, onAddTree)
    );
  };

  const onAddTree = async () => {
    try {
      const response = await apiRest.trees.post(currentTree);

      dialogRef.current?.open(
        "Success",
        "Votre arbre a été enregistré. Voulez-vous en enregistrer un autre ?",
        [
          {
            label: "Oui",
            action: (e) => {
              setTrees([...trees, currentTree]);
              setCurrentTree(initialTree);
            },
          },
          {
            label: "Non",
            action: (e) => {
              setCurrentTree({ ...currentTree, id: response.id });
              setTrees([...trees, currentTree]);
            },
          },
        ]
      );
    } catch (e) {
      onError(e);
    }
  };

  const onUpdateTree = async () => {
    try {
      // const response = await apiRest.trees.patch(currentTree.id, currentTree);
      // alertRef.current.create({
      //   title: "Success",
      //   message: `Votre arbre a été édité.`,
      //   actions: [{ label: "oui", value: true }],
      // });
    } catch (e) {
      onError(e);
    }
  };

  const onDeleteTree = async () => {
    try {
      const response = await apiRest.trees.delete(currentTree.id);

      // alertRef.current.create({
      //   title: "Success",
      //   message: "L'arbre a été supprimé.",
      //   actions: [{ label: "oui", value: null }],
      // });

      setCurrentTree(initialTree);
    } catch (e) {
      onError(e);
    }
  };

  const onError = (e) => {
    // alertRef.current.create({
    //   title: "Erreur",
    //   message: `Une erreur est survenue lors de l'enregistrement de l'arbre\n${e}`,
    //   actions: [{ label: "ok", value: true }],
    // });
  };

  return (
    <React.Fragment>
      <Grid
        className={classes.root}
        container
        item
        direction="column"
        spacing={1}
      >
        <Grid item>
          <Typography variant="h5">{props.titleText}</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {renderTextField(props.scientificNameText, "scientific_name")}
            </Grid>
            <Grid item xs={6}>
              {renderTextField(props.latitudeText, "y", "number")}
            </Grid>
            <Grid item xs={6}>
              {renderTextField(props.longitudeText, "x", "number")}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container justify="flex-end" spacing={1}>
          {renderControls()}
        </Grid>
      </Grid>
      <ETKDialog ref={dialogRef} />
    </React.Fragment>
  );
};

ETKSidebarAddTree.defaultProps = defaultProps;

export default ETKSidebarAddTree;
