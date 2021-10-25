import { DropzoneArea } from "material-ui-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";

interface ETKDropzoneProps {
  register: any;
  errors: any;
  fields: any;
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

export default function useDropzone(props: ETKDropzoneProps) {
  const classes = useStyle();
  const [file, setFile] = useState<File>();
  const [error, setError] = useState(null);

  const onAddFiles = async (event) => {
    setError(null);

    const fileList = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    if (fileList.length) {
      setFile(fileList[0]);
    }

    return [];
  };

  const fields = {};
  for (const name in props.fields) {
    const field = props.fields[name];
    const defaultFieldProps: any = {
      name,
      acceptedFiles: [".geojson", ".zip"],
      Icon: GetAppIcon,
      dropzoneText: "dropzoneText",
      dropzoneProps: {
        getFilesFromEvent: onAddFiles,
      },
      showPreviewsInDropzone: false,
      showFileNames: true,
      showAlerts: ["error"],
      maxFileSize: 50000000, //50MB
      filesLimit: 1,
      dropzoneParagraphClass: classes.etkDropzoneText,
      dropzoneClass: classes.etkDropzone,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    fields[name] = <DropzoneArea {...fieldProps} />;
  }

  return fields;
}
