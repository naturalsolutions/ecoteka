import { Grid, Box, Typography, Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { useGraphicBtnStyles } from "@/styles/Button/graphic";

const useStyles = makeStyles((theme) => ({
  grayscale: {
    // filter: "grayscale(100%)",
    maxWidth: "100%",
    height: "auto",
  },
  headline: {
    fontFamily: ["Quando", "-apple-system", "sans-serif"].join(","),
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  caption: {
    color: theme.palette.grey[700],
  },
}));

export interface LoginButtonProps {
  label: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ label }) => {
  const graphicStyles = useGraphicBtnStyles();
  const { t } = useTranslation(["components"]);
  const router = useRouter();
  return (
    <Button
      classes={graphicStyles}
      variant={"contained"}
      color={"primary"}
      onClick={() => router.push("/signin")}
    >
      {label}
    </Button>
  );
};

export interface CallToLoginProps {
  variant?: "wide" | "tiny";
  noHeadline?: boolean;
  noCaption?: boolean;
  headline?: string;
  caption?: string;
  label?: string;
}

const CallToLogin: React.FC<CallToLoginProps> = ({
  variant = "wide",
  noHeadline = false,
  noCaption = false,
  headline,
  caption,
  label,
}) => {
  const styles = useStyles();
  const graphicStyles = useGraphicBtnStyles();
  const { t } = useTranslation(["common", "components"]);

  if (variant == "tiny") {
    return (
      <LoginButton
        label={label ? label : t("components.CallToLogin.defaultLabel")}
      />
    );
  }

  if (variant == "wide") {
    return (
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Box width="144px" height="144px">
            <img src="/assets/signin-header.png" className={styles.grayscale} />
          </Box>
        </Grid>
        {!noHeadline && (
          <Grid item>
            <Typography
              variant="body1"
              component="h3"
              className={styles.headline}
            >
              {headline ? headline : t("components.CallToLogin.headline")}
            </Typography>
          </Grid>
        )}
        {!noCaption && (
          <Grid item>
            <Typography variant="body2" component="div" gutterBottom>
              <Box textAlign="center" className={styles.caption}>
                {caption ? caption : t("components.CallToLogin.defaultCaption")}
              </Box>
            </Typography>
          </Grid>
        )}
        <Grid item>
          <LoginButton
            label={label ? label : t("components.CallToLogin.defaultLabel")}
          />
        </Grid>
      </Grid>
    );
  }
};

export default CallToLogin;
