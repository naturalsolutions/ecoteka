import React, { FC } from "react";
import { Box, Button } from "@material-ui/core";

interface HeaderProps {}

const Header: FC<HeaderProps> = (props) => {
  return (
    <Box display="flex" flexDirection="row-reverse">
      <Box m={1}>
        <Button variant="contained" color="primary" disabled>
          Importer des données
        </Button>
      </Box>
      <Box m={1}>
        <Button variant="contained" color="primary" disabled>
          Exporter des données
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
