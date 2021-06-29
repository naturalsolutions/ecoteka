import React, { FC, ReactElement, Children } from "react";
import { makeStyles, Theme, List, Button } from "@material-ui/core";
import OptionsPanel, {
  CoreOptionsPanelProps,
} from "@/components/Core/OptionsPanel";
import InterventionsListNoData from "@/components/Interventions/List/NoData";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTreeContext } from "@/components/Tree/Provider";

export interface InterventionListContainerProps extends CoreOptionsPanelProps {
  noData?: ReactElement;
  allowNewInterventions?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionListContainer: FC<InterventionListContainerProps> = ({
  label,
  noData = <InterventionsListNoData />,
  allowNewInterventions = false,
  children,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { organization } = useAppContext();
  const { tree } = useTreeContext();

  const handleNewIntervention = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: "intervention",
        tree: tree.id,
        organizationSlug: organization.slug,
      },
    });
  };

  return (
    <OptionsPanel label={label}>
      <>
        {!Children.toArray(children).length ? noData : <List>{children}</List>}
        {allowNewInterventions && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNewIntervention}
          >
            planifier une intervention
          </Button>
        )}
      </>
    </OptionsPanel>
  );
};

export default InterventionListContainer;
