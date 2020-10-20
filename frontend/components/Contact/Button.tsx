import React, { useRef } from "react";
import {
  Button,
  ButtonProps,
  BottomNavigationAction,
  Grid,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import ETKFormContact, { ETKFormContactActions } from "./Form";

const ETKContactButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);
  const { dialog, theme } = useTemplate();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const formRef = useRef<ETKFormContactActions>();

  const onSubmitClick = async () => {
    const isOk = await formRef.current.submit();
    const successContent = (
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <CheckCircleIcon
            color={theme.palette.success.main}
            fontSize="large"
          />
        </Grid>
        <Grid item>
          <Typography>{t("Contact.successMessageContent")}</Typography>
        </Grid>
      </Grid>
    );

    const successActions = [
      {
        label: t("common:buttons.backToHome"),
        color: "secondary",
        variant: "contained",
      },
    ];

    if (isOk) {
      dialog.current.close();
      dialog.current.open({
        title: t("components:Contact.dialogTile"),
        content: successContent,
        actions: successActions,
      });
    }
  };

  const onButtonClick = () => {
    const dialogActions = [
      {
        label: t("components:Contact.buttonCancelContent"),
      },
      {
        label: t("components:Contact.buttonSubmitContent"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: onSubmitClick,
      },
    ];

    dialog.current.open({
      title: t("components:Contact.dialogTile"),
      content: <ETKFormContact ref={formRef} />,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  };

  return matches ? (
    <BottomNavigationAction
      label={t("Toolbar.about")}
      onClick={onButtonClick}
      {...props}
    />
  ) : (
    <Button onClick={onButtonClick} {...props}>
      {t("Toolbar.about")}
    </Button>
  );
};

export default ETKContactButton;
