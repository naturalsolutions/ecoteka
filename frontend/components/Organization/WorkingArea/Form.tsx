import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useTranslation, Trans } from "react-i18next";
import useApi from "@/lib/useApi";
import { IOrganization } from "@/index.d";
import { DropzoneArea } from "material-ui-dropzone";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useAppContext } from "@/providers/AppContext";

export type ETKFormWorkingAreaActions = {
  submit: () => Promise<boolean>;
};

export interface ETKFormWorkingAreaProps {
  organization: IOrganization;
}

const useStyle = makeStyles(() =>
  createStyles({
    content: {
      color: "#fff",
      backgroundColor: "#bbbbbb",
      borderRadius: "5px",
      padding: "5px 15px 5px 15px",
      width: "100%",
    },
    fullwidth: {
      width: "100%",
    },
    iconFileUploaded: {
      color: "white",
      borderRadius: "50%",
      backgroundColor: "green",
      margin: "1rem",
    },
    divider: {
      margin: ".5rem 0",
    },
    iconErrorUploaded: {
      color: "red",
      margin: "1rem",
    },
    etkDropzoneText: {
      whiteSpace: "pre",
    },
    etkDropzone: {},
    submitbtn: {
      alignSelf: "flex-end",
    },
  })
);

const ETKFormWorkingArea = forwardRef<
  ETKFormWorkingAreaActions,
  ETKFormWorkingAreaProps
>((props, ref) => {
  const classes = useStyle();
  const [file, setFile] = useState<File>();
  const { user, setUser } = useAppContext();
  const { snackbar } = useAppLayout();
  const { apiETK } = useApi().api;

  const { t } = useTranslation("components");
  let isOk = false;

  const openError = (message: string) => {
    snackbar.current.open({
      message: message,
      severity: "error",
    });
  };

  const submit = () => {
    if (!file) {
      openError("Veuillez sélectionner un fichier");
      return Promise.reject(false);
    }
    snackbar.current.open({
      message: "Envoi en cours...",
    });

    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file, file.name);

        const { status, data } = await apiETK.post(
          `/organization/${props.organization.id}/working_area`,
          formData
        );

        if (status !== 200) {
          openError(data);
          return reject(data);
        }

        isOk = true;
        resolve(data);
        const newUser = { ...user };
        newUser.currentOrganization.has_working_area = true;
        setUser(newUser);
      } catch (error) {
        openError(error?.response?.detail);
        reject(error?.response?.detail);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        await submit();
        return isOk;
      } catch (error) {
        return false;
      }
    },
  }));

  const onAddFiles = async (event) => {
    const fileList = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    if (fileList.length) {
      setFile(fileList[0]);
    }

    return [];
  };

  const ETKFiles = (
    <React.Fragment key={file?.name}>
      {file && (
        <Grid direction="row" container alignItems="center">
          <Grid item xs={2}>
            <GetAppIcon className={classes.iconFileUploaded} />
          </Grid>
          <Grid item xs={10}>
            {file?.name}
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5" paragraph>
          <Trans>
            {t("components.Organization.WorkingArea.dialogContentText")}
          </Trans>
        </Typography>
      </Grid>
      <Grid item>
        <DropzoneArea
          acceptedFiles={[".geojson", ".zip"]}
          Icon={GetAppIcon as any}
          dropzoneText={t("components.Import.Upload.dropzoneText")}
          dropzoneProps={{
            getFilesFromEvent: onAddFiles,
          }}
          showPreviewsInDropzone={false}
          showFileNames={true}
          showAlerts={["error"]}
          maxFileSize={50000000} //50MB
          filesLimit={1}
          dropzoneParagraphClass={classes.etkDropzoneText}
          dropzoneClass={classes.etkDropzone}
        />
      </Grid>
      {file ? (
        <React.Fragment>
          <Grid container alignItems="center">
            {ETKFiles}
          </Grid>
          <Divider className={classes.divider} />
        </React.Fragment>
      ) : null}
    </Grid>
  );
});

export default ETKFormWorkingArea;
