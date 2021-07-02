import { FC, useEffect } from "react";
import {
  makeStyles,
  Theme,
  Button,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArchiveIcon from "@material-ui/icons/Archive";
import SendIcon from "@material-ui/icons/Send";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMemberContext } from "@/components/Members/Provider";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTranslation } from "react-i18next";
import AddMembersButton from "@/components/Members/AddMembersButton";

export interface MembersToolbarProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  left: {
    display: "flex",
    flex: 1,
    gap: "10px",
  },
  right: {
    display: "flex",
    justifyContent: "flex-end",
    flex: 1,
    gap: "10px",
  },
}));

const MembersToolbar: FC<MembersToolbarProps> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["common", "components"]);
  const isBreakpointSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { organization } = useAppContext();
  const { selectedMembers } = useMemberContext();
  const hasSelectedMembers = Boolean(selectedMembers.length);
  const router = useRouter();

  const goBackToOrganization = () => {
    router.push(`/${router.query.organizationSlug}`);
  };

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Button
          variant="outlined"
          color="primary"
          onClick={goBackToOrganization}
        >
          <ArrowBackIcon /> {isBreakpointSM ? null : t("common.back")}
        </Button>
      </div>
      <div className={classes.right}>
        {hasSelectedMembers && (
          <>
            <Button variant="outlined" color="primary">
              <ArchiveIcon /> {isBreakpointSM ? null : t("common.archive")}
            </Button>
            <Button variant="outlined" color="primary">
              <DeleteIcon />
            </Button>
          </>
        )}
        <AddMembersButton />
      </div>
    </div>
  );
};

export default MembersToolbar;
