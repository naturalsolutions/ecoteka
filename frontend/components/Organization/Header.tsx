import React, { FC, useState, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";
import { apiRest } from "@/lib/api";
import useAPI from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface HeaderProps {}

const exportFormats = [
  {
    label: "Export CSV",
    format: "csv",
  },
  {
    label: "Export XLSX",
    format: "xlsx",
  },
  {
    label: "Export GeoJSON",
    format: "geojson",
  },
];

const Header: FC<HeaderProps> = (props) => {
  const anchorRef = useRef(null);
  const { user } = useAppContext();
  const router = useRouter();
  const { api } = useAPI();
  const { t } = useTranslation(["components", "common"]);
  const { apiETK } = api;
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const downloadFile = (blob, filename) => {
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    console.log(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();
    a.remove();
  };

  const handleClick = async (index: number) => {
    try {
      console.log("pending)");
      const response = await apiETK.get(
        `/organization/${user.currentOrganization.id}/trees/export/?format=${exportFormats[index].format}`
      );
      if (response.status === 200) {
        console.log("stale)");
        try {
          console.log("wait blob");
          const blob = await response.data.blob();
          const filename = `export-trees-${user.currentOrganization.slug}.${exportFormats[index].format}`;
          downloadFile(blob, filename);
        } catch (e) {
          console.log(e);
        } finally {
          console.log("blob ready to export!");
        }
      }
    } catch (e) {
      console.log(e);
    }
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
    <Box display="flex" flexDirection="row-reverse">
      <Box m={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/edition/?panel=import")}
        >
          Importer des données
        </Button>
      </Box>
      <Box m={1}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button onClick={() => handleClick(selectedIndex)}>
            {exportFormats[selectedIndex].label}
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
                        key={option.label}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  );
};

export default Header;
