import { TMember } from "@/components/Members/Schema";
import {
  Avatar,
  makeStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  ListItemIcon,
} from "@material-ui/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useMemberContext } from "../Provider";

export interface MemberItemProps {
  selectable: boolean;
  member: TMember;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
  },
  avatar: {
    width: 28,
    height: 28,
    margin: theme.spacing(1),
  },
}));

const MemberItem: FC<MemberItemProps> = ({ member, selectable }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { selectedMembers, setSelectedMembers } = useMemberContext();

  const goToUserProfile = () => {
    // Navigate to User Profile
  };

  const handleToggle = (id: number) => () => {
    const currentIndex = selectedMembers.indexOf(id);
    const newSelectedMember = [...selectedMembers];

    if (currentIndex === -1) {
      newSelectedMember.push(id);
    } else {
      newSelectedMember.splice(currentIndex, 1);
    }
    setSelectedMembers(newSelectedMember);
  };

  return (
    <>
      <ListItem>
        {selectable && (
          <ListItemIcon>
            <Checkbox
              onClick={handleToggle(member.id)}
              edge="end"
              checked={selectedMembers.indexOf(member.id) !== -1}
              tabIndex={-1}
              disabled={member.role == "owner"}
              disableRipple
              inputProps={{ "aria-labelledby": member.role }}
            />
          </ListItemIcon>
        )}

        <ListItemAvatar>
          <Avatar>{member.full_name[0]}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={member.full_name} secondary={member.role} />
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default MemberItem;
