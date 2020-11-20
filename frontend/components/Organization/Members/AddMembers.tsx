import React, { FC, useState } from "react";
import { Box, Button, Chip, makeStyles, MenuItem, Select, TextField } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { apiRest } from "@/lib/api";

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
}));

interface AddMemberProps {
  organizationID: number;
}

const AddMember: FC<AddMemberProps> = ({ organizationID }) => {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const { register, control, handleSubmit, getValues, setValue } = useForm();
  const { fields, append, prepend, remove } = useFieldArray({
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

  const handleRemoveField = (fieldIdx: number) => () => {
    remove(fieldIdx);
  };

  const isValid = (email) => {
    let error = null;

    if (isInList(email)) {
      error = `<${email}> est déjà présent dans la liste des invitations.`;
    }

    if (!isEmail(email)) {
      error = `<${email}> n'est pas une adresse valide.`;
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

  const onSubmit = async (data) => {
    const { members } = data;
    const response = await apiRest.organization.addMembers(organizationID, members);
  };

  const roles = [
    {
      label: "Manager",
      value: "manager",
    },
    {
      label: "Contributeur",
      value: "contributor",
    },
    {
      label: "Lecteur",
      value: "reader",
    },
    {
      label: "Invité",
      value: "guest",
    },
  ];

  return (
    <Box width="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          name="main"
          inputRef={register}
          error={Boolean(error)}
          helperText={error?.error}
          size="small"
          id="email-input"
          label="Emails des membres à inviter"
          variant="outlined"
          className={"input " + (error && " has-error")}
          placeholder="Saisir les emails des membres à inviter puis appuyer sur `Entrée`..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <Box mt={2} mb={3}>
          {fields.map((member: any, index: number) => {
            let icon;
            return (
              <Box key={member.id} flexDirection="row">
                <Box component="span" display="none">
                  <TextField inputRef={register} name={`members[${index}].email`} defaultValue={member.email} />
                </Box>
                <Chip icon={icon} label={member.email} onDelete={() => remove(index)} className={classes.chip} />
                <Controller
                  as={
                    <Select name={`members[${index}].role`} defaultValue={member.role}>
                      {roles.map((role, i) => {
                        return (
                          <MenuItem value={role.value} key={i}>
                            {role.label}
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
        <Button type="submit" variant="contained" color="secondary" endIcon={<SendIcon />}>
          Inviter
        </Button>
      </form>
    </Box>
  );
};

export default AddMember;
