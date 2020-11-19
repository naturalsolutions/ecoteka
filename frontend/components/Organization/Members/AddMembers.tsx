import React, { FC, useState } from "react";
import { Box, Chip, makeStyles, TextField } from "@material-ui/core";

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
  },
}));

const AddMember: FC = (props) => {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  const handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      const input = value.trim();

      if (input && isValid(input)) {
        setItems([...items, value]);
        setValue("");
      }
    }
  };

  const handleChange = (evt) => {
    setValue(evt.target.value);
    setError(null);
  };

  const handleDelete = (item) => () => {
    setItems(items.filter((i) => i !== item));
  };

  const handlePaste = (evt) => {
    evt.preventDefault();

    const paste = evt.clipboardData.getData("text");
    const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      const toBeAdded = emails.filter((email) => !isInList(email));
      setItems([...items, ...toBeAdded]);
    }
  };

  const isValid = (email) => {
    let error = null;

    if (isInList(email)) {
      error = `${email} est déjà dans la liste des invitations.`;
    }

    if (!isEmail(email)) {
      error = `${email} n'est pas une adresse valide.`;
    }

    if (error) {
      setError({ error });
      return false;
    }
    return true;
  };

  const isInList = (email) => {
    return items.includes(email);
  };

  const isEmail = (email) => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  return (
    <Box width="full">
      <TextField
        fullWidth
        error={Boolean(error)}
        helperText={error?.error}
        size="small"
        id="email-input"
        label="Emails des membres à inviter"
        variant="outlined"
        className={"input " + (error && " has-error")}
        value={value}
        placeholder="Saisir les emails des membres à inviter puis appuyer sur `Entrée`..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onPaste={handlePaste}
      />
      <Box component="ul" className={classes.chipsContainer}>
        {items.map((item, idx) => {
          let icon;
          return (
            <li key={idx}>
              <Chip icon={icon} label={item} onDelete={handleDelete(item)} className={classes.chip} />
            </li>
          );
        })}
      </Box>
    </Box>
  );
};

export default AddMember;
