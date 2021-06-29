import React, { FC, ReactElement, Children } from "react";
import { makeStyles, Theme, List } from "@material-ui/core";
import OptionsPanel, {
  CoreOptionsPanelProps,
} from "@/components/Core/OptionsPanel";

export interface MembersListContainerProps extends CoreOptionsPanelProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MembersListContainer: FC<MembersListContainerProps> = ({
  label,
  children,
}) => {
  const classes = useStyles();

  return (
    <OptionsPanel label={label}>
      <List>{children}</List>
    </OptionsPanel>
  );
};

export default MembersListContainer;
