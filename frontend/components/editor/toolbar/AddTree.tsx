import React from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useTranslation } from "react-i18next";

export const EditorToolbarAddTreeOptions: string[] = [
  "ADD",
  "ADD_FROM_COORDINATES",
];

export interface EditorToolbarAddTreeProps {
  onChange?(option: number): void;
}

const defaultProps: EditorToolbarAddTreeProps = {};

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: "#212121",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#313131",
    },
  },
}));

const EditorToolbarAddTree: React.FC<EditorToolbarAddTreeProps> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const { t } = useTranslation();

  const handleMenuItemClick = (event, index: number) => {
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

  const handleClick = () => {
    if (typeof props.onChange === "function") {
      props.onChange(selectedIndex);
    }
  };

  return (
    <>
      <ButtonGroup
        size="small"
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button className={classes.button} onClick={handleClick}>
          {EditorToolbarAddTreeOptions[selectedIndex]}
        </Button>
        <Button
          className={classes.button}
          size="small"
          aria-controls={open ? "editor-toolbar-add-tree" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
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
        disablePortal
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
                <MenuList id="editor-toolbar-add-tree">
                  {EditorToolbarAddTreeOptions.map(
                    (option: string, index: number) => (
                      <MenuItem
                        key={index}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {EditorToolbarAddTreeOptions[index]}
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

EditorToolbarAddTree.defaultProps = defaultProps;

export default EditorToolbarAddTree;
