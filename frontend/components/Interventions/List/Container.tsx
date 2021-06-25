import React, { FC, ReactElement, Children } from "react";
import { makeStyles, Theme, List } from "@material-ui/core";
import OptionsPanel, {
  CoreOptionsPanelProps,
} from "@/components/Core/OptionsPanel";
import InterventionsListNoData from "@/components/Interventions/List/NoData";

export interface InterventionListContainerProps extends CoreOptionsPanelProps {
  noData?: ReactElement;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionListContainer: FC<InterventionListContainerProps> = ({
  label,
  noData = <InterventionsListNoData />,
  children,
}) => {
  const classes = useStyles();

  return (
    <OptionsPanel label={label}>
      {!Children.toArray(children).length ? noData : <List>{children}</List>}
    </OptionsPanel>
  );
};

export default InterventionListContainer;
