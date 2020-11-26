import React, { useState, useEffect } from "react";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";

export interface ETKTreeInfosExpandedProps {
  data?: number;
  showLess?: () => void;
}

const defaultProps: ETKTreeInfosExpandedProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = ({
  data,
  showLess,
}) => {
  const classes = useStyles();
  const [displayData, setDisplayData] = useState(data);

  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  return (
    <Box>
      <Typography>Expanded</Typography>
      <Box>{displayData}</Box>
      <Button variant="contained" onClick={showLess}>
        Réduire
      </Button>
    </Box>
  );
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;
