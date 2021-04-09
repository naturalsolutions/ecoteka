import { Grid } from "@material-ui/core";
import { FC } from "react";
import MemberItemHeader from "@/components/Member/ItemHeader";

const MemberList: FC = ({ children }) => {
  return (
    <>
      <Grid container direction="column" spacing={1}>
        <MemberItemHeader />
        {children}
      </Grid>
    </>
  );
};

export default MemberList;
