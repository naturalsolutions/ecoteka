import { FC } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  Button,
  Typography,
  ButtonProps,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

export interface CoreErrorProps {
  errorCode: number;
  buttonText?: string;
  errorMessage?: string;
  captionText?: string;
  onClick?: () => void;
}
export interface CallToActionButtonProps {
  errorCode: number;
}

const useButtonStyles = makeStyles<Theme>((theme: Theme) => ({
  root: {},
}));

const useStyles = makeStyles<Theme, CoreErrorProps>((theme: Theme) => ({
  root: {
    background: "url('/assets/background_bw.svg')",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    height: "calc(100vh - 100px)",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  figure: {
    paddingTop: theme.spacing(6),
    paddingBottoom: theme.spacing(2),
    textAlign: "center",
  },
  image: {
    width: "80%",
  },
  button: {
    padding: "10px 20px",
  },
  messageContainer: {
    maxWidth: "600px",
    textAlign: "center",
  },
  message: {
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#3F3D56",
    fontSize: "1rem",
  },
  credit: {
    position: "absolute",
    bottom: "5px",
    right: "10px",
    color: "#fff",
  },
  ctaContainer: {
    maxWidth: "600px",
    paddingTop: theme.spacing(4),
  },
  [theme.breakpoints.up("sm")]: {
    root: {
      width: "100vw",
    },
    image: {
      width: "80%",
    },
  },
}));

export const BackButton: FC<ButtonProps> = (props) => {
  const classes = useButtonStyles();
  const { t } = useTranslation(["common"]);
  const router = useRouter();
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      startIcon={<ArrowBackIcon />}
      onClick={() => router.back()}
    >
      {t("common.previousPage")}
    </Button>
  );
};

const CallToActionButton: FC<CallToActionButtonProps> = ({ errorCode }) => {
  const { t } = useTranslation(["components"]);
  const router = useRouter();

  const callToActionMessage = (errorCode: number): string => {
    const coveredErrorStatusCodes = [401, 404, 403, 500];
    return coveredErrorStatusCodes.includes(errorCode)
      ? t(`components.Core.Error.CallToActionButton.message.${errorCode}`)
      : t("common.home");
  };

  const fallbackUrl = (errorCore: number): string => {
    switch (errorCore) {
      case 403:
      case 404:
      case 404:
        return "/";
      case 401:
        return "/signin";
      default:
        return "/";
    }
  };
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => router.push(fallbackUrl(errorCode))}
      disabled={errorCode == 403}
    >
      {callToActionMessage(errorCode)}
    </Button>
  );
};

const CoreError: FC<CoreErrorProps> = (props) => {
  const { errorCode, children, ...rest } = props;
  const classes = useStyles(props);
  const { t } = useTranslation(["components"]);

  const errorMessage = (errorCode: number): string => {
    const coveredErrorStatusCodes = [401, 404, 403, 500];
    return coveredErrorStatusCodes.includes(errorCode)
      ? t(`components.Core.Error.message.500`)
      : t("components.Core.Error.message.unknown");
  };

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>
        <figure className={classes.figure}>
          <img
            className={classes.image}
            alt={`Erreur ${errorCode}`}
            src={`/assets/erreur-${errorCode}.png`}
          />
          {children}
        </figure>
      </Grid>
      <Grid item className={classes.messageContainer}>
        <Typography variant="caption" className={classes.message}>
          {errorMessage(errorCode)}
        </Typography>
      </Grid>
      <Grid
        container
        item
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.ctaContainer}
      >
        <Grid item>
          <BackButton />
        </Grid>
        <Grid item>
          <CallToActionButton errorCode={errorCode} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CoreError;
