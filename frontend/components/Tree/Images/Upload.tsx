import { FC, useState } from "react";
import { makeStyles, Theme, Button, Grid, Box } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useTranslation } from "react-i18next";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";

export interface TreeImagesUploadProps {
  treeId: number;
  onChange?(images: []): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiDropzoneArea-root": {
      minHeight: "auto",
      height: 200,
    },
  },
}));

const TreeImagesUpload: FC<TreeImagesUploadProps> = ({ treeId, onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [filesLimit, setFilesLimit] = useState<number>(6);
  const [files, setFiles] = useState([]);
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();

  const handleOnChange = (loadedFiles) => {
    setFiles(loadedFiles);
  };

  const handleSendImages = async () => {
    try {
      const formData = new FormData();

      Array.from(files).map((file) => {
        formData.append("images", file, file.name);
      });

      const { status, data } = await apiETK.post(
        `/organization/${organization.id}/trees/${treeId}/images`,
        formData
      );

      if (status === 200) {
        onChange(data);
      }
    } catch (error) {}
  };

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item xs>
        <DropzoneArea
          acceptedFiles={["image/*"]}
          dropzoneText={t("components.TreeForm.imagesUpload.select", {
            max: filesLimit,
          })}
          filesLimit={filesLimit}
          showAlerts={["error"]}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item>
        <Box my={1} />
      </Grid>
      {files.length > 0 && (
        <Grid item>
          <Button
            onClick={handleSendImages}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            {t("common.buttons.send")}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default TreeImagesUpload;
