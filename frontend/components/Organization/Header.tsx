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
  {
    label: "Export Shapefile",
    format: "shp",
  },
];

const Header: FC<HeaderProps> = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleClick = async () => {
    const response = await fetch(`/api/v1/organization/1/trees/export`);

    if (response.ok) {
      const json = await response.json();
      console.log(json);
    }

    console.info(
      `Export format selected ${exportFormats[selectedIndex].format}`
    );
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
        <Button variant="contained" color="primary" href={`/?panel=import`}>
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
          <Button onClick={handleClick}>
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
