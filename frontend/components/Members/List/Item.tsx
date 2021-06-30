import { FC, Fragment } from "react";
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
  IconButton,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";
import { useMemberContext } from "../Provider";
import { teal, deepOrange } from "@material-ui/core/colors";

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
  inline: {
    display: "inline",
  },
  editable: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  display: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
  },
}));

const MemberItem: FC<MemberItemProps> = ({ member, selectable }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    selectedMembers,
    setSelectedMembers,
    editableMembers,
    setEditableMembers,
  } = useMemberContext();

  const goToUserProfile = () => {
    // TODO: Navigate to User Profile
  };

  const setItemEditable = (id: number) => () => {
    // TODO: Handle edit mode for item
    const currentEditIndex = editableMembers.indexOf(id);
    const newEditableMembers = [...editableMembers];

    if (currentEditIndex === -1) {
      newEditableMembers.push(id);
    } else {
      newEditableMembers.splice(currentEditIndex, 1);
    }
    setEditableMembers(newEditableMembers);
  };

  const handleToggle = (id: number) => () => {
    const currentSelectIndex = selectedMembers.indexOf(id);
    const newSelectedMember = [...selectedMembers];

    if (currentSelectIndex === -1) {
      newSelectedMember.push(id);
    } else {
      newSelectedMember.splice(currentSelectIndex, 1);
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
          <Avatar
            className={
              classes[
                editableMembers.indexOf(member.id) !== -1
                  ? "editable"
                  : "display"
              ]
            }
          >
            {member.full_name[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={member.full_name}
          secondary={
            <Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {`${member.email} • `}
              </Typography>
              {member.role}
            </Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={setItemEditable(member.id)}
          >
            {editableMembers.indexOf(member.id) !== -1 ? (
              <CancelIcon />
            ) : (
              <EditIcon />
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default MemberItem;
