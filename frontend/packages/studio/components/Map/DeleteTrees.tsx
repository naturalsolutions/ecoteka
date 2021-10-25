import { FC } from "react";
import { makeStyles, Button, Box, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import Can from "@/components/Can";

export interface MapDeleteTreesProps {
  active?: boolean;
  message?: string;
  onDelete?(): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
  },
  delete: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const MapDeleteTrees: FC<MapDeleteTreesProps> = ({
  onDelete,
  active = false,
  message,
}) => {
  const classes = useStyles();
  const { t } = useTranslation("common");

  return (
    <Can do="manage" on="Trees">
      <Grid container justifyContent="center" alignItems="center">
        {active && (
          <Box ml={2}>
            <Button
              className={classes.delete}
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
            >
              {t("common.delete")}
              {message ? ` ${message}` : null}
            </Button>
          </Box>
        )}
      </Grid>
    </Can>
  );
};

export default MapDeleteTrees;
