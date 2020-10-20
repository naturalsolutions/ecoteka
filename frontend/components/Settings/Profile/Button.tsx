import React, { useRef } from "react";
import { Button, ButtonProps} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../../Template";
import ETKProfileForm, { ETKFormProfileActions } from "./Form";

const ETKProfileButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);
  const { dialog, theme } = useTemplate();
  const formRef = useRef<ETKFormProfileActions>();

  const onButtonClick = async () => {
    dialog.current.open({
      title: t("components:Profile.dialogTitle"),
      content: <ETKProfileForm ref={formRef} />,
      actions: [
        {
          label: t("components:Profile.cancel"),
        },
        {
          label: t("components:Profile.submit"),
          noClose: true,
          variant: "contained",
          color: "secondary",
          onClick: onSubmitClick,
        },
      ],
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        disableBackdropClick: true,
      },
    });
  };

  const onSubmitClick = async () => {
    const valid = await formRef.current.submit();

    if (valid) {
      dialog.current.open({
        title: t("common:messages.success"),
        content: t("components:Profile.formCompleted"),
        actions: [{ label: "ok" }],
      });
    }
  };

  return (
    <Button onClick={onButtonClick} {...props}>
      {t("components:Profile.buttonTitle")}
    </Button>
  );
};

export default ETKProfileButton;
