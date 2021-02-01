import React, { forwardRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Toolbar,
} from "@material-ui/core";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import useApi from "@/lib/useApi";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  chipsContainer: {
    display: "flex",
    justifyContent: "start",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
    marginRight: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

interface IMemberProps {
  email: string;
  role: string;
  status: string;
  id: number;
}

type AddMembersActionsProps = {
  ok: Boolean;
  redirected: Boolean;
  status: Number;
  statusText: String;
  type: String;
  url: String;
};

export type AddMembersActions = {
  submit: () => Promise<AddMembersActionsProps>;
};

export interface AddMembersProps {
  organizationId: number;
  closeAddMembersDialog: (refetchOrganizationData: boolean) => void;
}

const AddMembers = forwardRef<AddMembersActions, AddMembersProps>(
  ({ organizationId, closeAddMembersDialog }) => {
    const classes = useStyles();
    const { api } = useApi();
    const { apiETK } = api;
    const { t } = useTranslation(["components", "common"]);
    const [error, setError] = useState(null);
    const { register, control, handleSubmit, getValues, setValue } = useForm();
    const { fields, append, remove } = useFieldArray({
      control,
      name: "members",
    });

    const handleKeyDown = (evt) => {
      if (["Enter", "Tab", ","].includes(evt.key)) {
        evt.preventDefault();

        const input = getValues("main").trim();

        if (input && isValid(input)) {
          append({ email: input, role: "guest" });
          setValue("main", "");
        }
      }
    };

    const handleChange = (evt) => {
      setError(null);
    };

    const handlePaste = (evt) => {
      evt.preventDefault();

      const paste = evt.clipboardData.getData("text");
      const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

      if (emails) {
        const toBeAdded = emails.filter((email) => !isInList(email));
        toBeAdded.map((email, index) => {
          setTimeout(() => append({ email: email, role: "guest" }), 50);
        });
      }
    };

    const isValid = (email) => {
      let error = null;

      if (isInList(email)) {
        error = `<${email}> ${t(
          "components.Organization.Members.dialog.errorEmailAlreadyAdded"
        )}`;
      }

      if (!isEmail(email)) {
        error = `<${email}> ${t(
          "components.Organization.Members.dialog.errorEmailFormatNotValid"
        )}`;
      }

      if (error) {
        setError({ error });
        return false;
      }
      return true;
    };

    const isInList = (email) => {
      const emails = fields.map((field) => {
        return field.email;
      });
      return emails.includes(email);
    };

    const isEmail = (email) => {
      return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    };

    const closeDialog = () => {
      closeAddMembersDialog(false);
    };

    const inviteMembers = async (data) => {
      const { members } = data;
      try {
        const response = await apiETK.post(
          `/organization/${organizationId}/members`,
          members
        );
        if (response.status === 200) {
          closeAddMembersDialog(true);
        }
      } catch (e) {}
    };

    const roles = [
      {
        value: "manager",
      },
      {
        value: "contributor",
      },
      {
        value: "reader",
      },
      {
        value: "guest",
      },
    ];

    return (
      <Box width="full">
        <form onSubmit={handleSubmit(inviteMembers)}>
          <TextField
            fullWidth
            name="main"
            inputRef={register}
            error={Boolean(error)}
            helperText={error?.error}
            size="small"
            id="email-input"
            label={t("components.Organization.Members.dialog.emailsLabel")}
            variant="outlined"
            className={"input " + (error && " has-error")}
            placeholder={t(
              "components.Organization.Members.dialog.emailsPlaceholder"
            )}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
          {!(fields.length > 0) && (
            <Box mt={2} mb={3}>
              <Alert severity="info">
                <AlertTitle>
                  {t("components.Organization.Members.dialog.alertTitle")}
                </AlertTitle>
                {t("components.Organization.Members.dialog.alertContent1")}
                <strong>
                  {t("components.Organization.Members.dialog.alertContent2")}
                </strong>
              </Alert>
            </Box>
          )}

          <Box mt={2} mb={3}>
            {fields.map((member: any, index: number) => {
              let icon;
              return (
                <Box key={member.id} flexDirection="row">
                  <Box component="span" display="none">
                    <TextField
                      inputRef={register}
                      name={`members[${index}].email`}
                      defaultValue={member.email}
                    />
                  </Box>
                  <Chip
                    icon={icon}
                    label={member.email}
                    onDelete={() => remove(index)}
                    className={classes.chip}
                  />
                  <Controller
                    as={
                      <Select
                        name={`members[${index}].role`}
                        defaultValue={member.role}
                      >
                        {roles.map((role, i) => {
                          return (
                            <MenuItem value={role.value} key={i}>
                              {t(
                                `components.Organization.Members.Table.roles.${role.value}`
                              )}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    }
                    name={`members[${index}].role`}
                    defaultValue={member.role}
                    control={control}
                  />
                </Box>
              );
            })}
          </Box>
          <Toolbar disableGutters={true}>
            <Button onClick={closeDialog}>
              {t("components.Organization.Members.close")}
            </Button>
            <div className={classes.grow} />
            <Button
              variant="contained"
              color="primary"
              disabled={!Boolean(fields.length > 0)}
              type="submit"
            >
              {t("components.Organization.Members.invite")}
            </Button>
          </Toolbar>
        </form>
      </Box>
    );
  }
);

export default AddMembers;
