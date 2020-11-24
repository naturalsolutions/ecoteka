import { FC, Fragment, useRef } from "react";
import { IOrganization } from "@/index.d";
import { useQuery, useQueryCache } from "react-query";
import { apiRest } from "@/lib/api";
import { Box, Button, makeStyles, Toolbar } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { useRouter } from "next/router";

import { useTemplate } from "@/components/Template";
import ETKFormOrganization, { ETKFormOrganizationActions } from "@/components/Organization/Form/Form";
import ETKFormWorkingArea, { ETKFormWorkingAreaActions } from "@/components/Organization/WorkingArea/Form";
import TeamsTable from "@/components/Organization/Teams/TeamsTable";
import { useTranslation } from "react-i18next";

interface TeamsProps {
  organization: IOrganization;
  value: string | string[];
  index: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  toolbar: {
    flexDirection: "row",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Teams: FC<TeamsProps> = (props) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);
  const router = useRouter();

  const cache = useQueryCache();
  const queryName = `teams_${props.organization.id}`;
  const { status, data, error, isFetching } = useQuery(
    queryName,
    async () => {
      const data = await apiRest.organization.teams(props.organization.id);
      console.log(data);
      return data;
    },
    {
      enabled: Boolean(props.organization),
    }
  );

  function openForm(organization?) {
    const isNew = !Boolean(organization);
    const dialogActions = [
      {
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: addItem,
      },
    ];

    dialog.current.open({
      title: t(`components:Team.dialogTitle${isNew ? "Create" : "Edit"}`),
      content: (
        <ETKFormOrganization
          ref={formEditRef}
          organization={
            organization || {
              parent_id: props.organization.id,
            }
          }
        />
      ),
      actions: dialogActions,
    });
  }

  const addItem = async () => {
    const isOk = await formEditRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries(queryName);
    }
  };

  function openArea(organization) {
    const dialogActions = [
      {
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: editWorkingArea,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.WorkingArea.dialogTitle"),
      content: <ETKFormWorkingArea ref={formAreaRef} organization={organization} />,
      actions: dialogActions,
    });
  }

  const editWorkingArea = async () => {
    const isOk = await formAreaRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries("teams");
    }
  };

  const openTeamPage = (id) => {
    router.push(`/organization/${id}`);
  };

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={() => {
            openForm();
          }}
        >
          {t("Teams.buttonAdd")}
        </Button>
      </Toolbar>
      <TeamsTable rows={data} openArea={openArea} openTeamPage={openTeamPage} openForm={openForm} />
    </Fragment>
  );
};

export default Teams;
