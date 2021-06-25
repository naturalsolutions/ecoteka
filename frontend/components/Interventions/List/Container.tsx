import React, { FC } from "react";
import { makeStyles, Theme, List } from "@material-ui/core";
import OptionsPanel, {
  CoreOptionsPanelProps,
} from "@/components/Core/OptionsPanel";

export interface InterventionListContainerProps extends CoreOptionsPanelProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionListContainer: FC<InterventionListContainerProps> = ({
  title,
  children,
}) => {
  const classes = useStyles();

  return (
    <OptionsPanel title={title}>
      <List>{children}</List>
    </OptionsPanel>
  );
};

export default InterventionListContainer;
