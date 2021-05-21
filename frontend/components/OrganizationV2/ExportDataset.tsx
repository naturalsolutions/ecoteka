import React, { FC, useState, useRef, Fragment } from "react";
import {
  makeStyles,
  Theme,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { green, blue } from "@material-ui/core/colors";
import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";
import useAPI from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import SnackAlert, { SnackAlertProps } from "@/components/Feedback/SnackAlert";
import Can from "@/components/Can";

export interface ExportDatasetProps {}

const exportFormats = [
  {
    format: "csv",
  },
  {
    format: "xlsx",
  },
  {
    format: "geojson",
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  buttonSuccess: {
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
  buttonProgress: {
    color: blue[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const ExportDataset: FC<ExportDatasetProps> = ({}) => {
  const classes = useStyles();
  const anchorRef = useRef(null);
  const { organization } = useAppContext();
  const router = useRouter();
  const { api } = useAPI();
  const { t } = useTranslation(["components", "common"]);
  const { apiETK } = api;
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [pending, setPending] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMesagge] = useState<
    Pick<SnackAlertProps, "message" | "severity">
  >({
    message: "",
    severity: "success",
  });

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();
    a.remove();
  };

  const triggerAlert = ({ message, severity }) => {
    setAlertMesagge({
      message: message,
      severity: severity,
    });
    setOpenAlert(true);
    setTimeout(() => setOpenAlert(false), 3000);
  };

  const handleClick = async (index: number) => {
    try {
      setPending(true);
      triggerAlert({
        message: t("components.Organization.exportPending"),
        severity: "info",
      });
      let response = await apiETK.get(
        `/organization/${organization.id}/trees/export/?format=${exportFormats[index].format}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {},
        }
      );
      if (response.status === 200) {
        // request is stale
        setPending(false);
        triggerAlert({
          message: t("components.Organization.exportSuccess"),
          severity: "success",
        });
        try {
          const blob = await response.data;
          const filename = `export-trees-${organization.slug}.${exportFormats[index].format}`;
          downloadFile(blob, filename);
        } catch (e) {
        } finally {
        }
      }
    } catch (e) {}
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Can do="read" on="Trees">
      <Box m={1}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button disabled={pending} onClick={() => handleClick(selectedIndex)}>
            {`${t("common.buttons.export")} ${
              exportFormats[selectedIndex].format
            }`}
            {pending && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select export format"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="top"
          transition
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "window",
            },
          }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {exportFormats.map((option, index) => (
                      <MenuItem
                        key={option.format}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {`${t("common.buttons.export")} ${option.format}`}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Can>
  );
};

export default ExportDataset;
