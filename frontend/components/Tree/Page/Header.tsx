import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useTreeContext } from "@/components/Tree/Provider";

export type Mode = "read" | "write";

export interface ITreePageHeaderProps {
  onChange?(mode: Mode): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
}));

const TreePageHeader: React.FC<ITreePageHeaderProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const router = useRouter();
  const { organization } = useAppContext();
  const [mode, setMode] = useState<Mode>("read");
  const theme = useTheme();
  const matchesDraw = useMediaQuery(theme.breakpoints.down("md"));
  const [saving, setSaving] = useState<boolean>(false);
  const { onSave } = useTreeContext();

  const handleGoMap = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: matchesDraw ? null : "info",
        tree: router.query.id,
        organizationSlug: organization.slug,
      },
    });
  };

  const handleOnAction = async () => {
    const newMode = mode === "read" ? "write" : "read";

    if (newMode === "read") {
      try {
        setSaving(true);
        await onSave();
      } catch (e) {
      } finally {
        setSaving(false);
      }
    }

    setMode(newMode);
    onChange(newMode);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item>
        <Button onClick={handleGoMap} startIcon={<ArrowBackIcon />}>
          {t("common.map")}
        </Button>
      </Grid>
      <Grid item xs />
      <Grid item>
        <Button
          disabled={saving}
          variant="contained"
          color="primary"
          onClick={handleOnAction}
        >
          {mode === "read" ? t("common.edit") : t("common.save")}
          {saving && <CircularProgress color="inherit" size={20} />}
        </Button>
      </Grid>
    </Grid>
  );
};

export default TreePageHeader;
