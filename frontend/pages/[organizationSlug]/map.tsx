import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Head from "next/head";
import { NextPage } from "next";
import { useRouter } from "next/router";

import AppLayoutCarto from "@/components/AppLayout/Carto";
import OrganizationLoadingProgress from "@/components/OrganizationV2/LoadingProgress";
import MapProvider, { useMapContext } from "@/components/Map/Provider";
import MapContainer from "@/components/Map/Container";
import MapActionsBar, {
  MapActionsBarActionType,
} from "@/components/Map/ActionsBar";
import { useAppContext } from "@/providers/AppContext";
import MapPanelInfo from "@/components/Map/Panel/Info";
import MapPanelFilter from "@/components/Map/Panel/Filter";
import MapPanelLayers, { defaultLayers } from "@/components/Map/Panel/Layers";
import MapActionsList from "@/components/Map/Actions/List";
import MapActionsCreateTree from "@/components/Map/Actions/CreateTree";
import MapActionsGeolocation from "@/components/Map/Actions/Geolocation";
import MapActionsSelection from "@/components/Map/Actions/Selection";
import MapActionsFitToBounds from "@/components/Map/Actions/FitToBounds";
import CadastreLayer from "@/components/Map/Layers/Cadastre";
import OSMLayer from "@/components/Map/Layers/OSM";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({}));

const defaultFilter = {
  canonicalName: [],
  vernacularName: [],
};

const defaultFilters = {
  filters: defaultFilter,
  options: defaultFilter,
  values: defaultFilter,
};

const Map: FC = () => {
  const router = useRouter();
  const { organization } = useAppContext();
  const [filters, setFilters] = useState(defaultFilters);
  const { info, setInfo } = useMapContext();
  const { t } = useTranslation();

  const handleOnMapActionsBarClick = (action: MapActionsBarActionType) => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        ...router.query,
        panel: action,
        organizationSlug: organization.slug,
      },
    });
  };

  const handleOnFilter = (values, filters, options) => {
    setFilters({
      options,
      filters,
      values,
    });
  };

  const handleOnMapHover = (newInfo) => {
    setInfo(undefined);

    if (newInfo.picked && newInfo.layer?.id == "cadastre" && newInfo.object) {
      setInfo({
        title: t("components.Map.Layers.Cadastre.title"),
        x: newInfo.x,
        y: newInfo.y,
        properties: newInfo.object.properties,
        source: "source: Etalab · https://openmaptiles.geo.data.gouv.fr",
      });
    }
  };

  return (
    <>
      <MapContainer
        DeckGLProps={{
          onHover: handleOnMapHover,
        }}
      >
        <MapActionsBar onClick={handleOnMapActionsBarClick} />
        <MapActionsList>
          <MapActionsGeolocation />
          <MapActionsFitToBounds />
          <MapActionsSelection />
          <MapActionsCreateTree />
        </MapActionsList>
      </MapContainer>
      <MapPanelInfo />
      <MapPanelFilter initialValue={filters.values} onChange={handleOnFilter} />
      <MapPanelLayers />
    </>
  );
};

const OrganizationMapPage: NextPage = ({}) => {
  const { organization } = useAppContext();

  if (!organization) return null;

  const cadastreLayer = CadastreLayer(true);
  const osmLayer = OSMLayer({ visible: true });

  return (
    <AppLayoutCarto skeleton={<OrganizationLoadingProgress />}>
      <Head>
        <title>ecoTeka - Map</title>
      </Head>
      <MapProvider
        layers={[cadastreLayer, osmLayer]}
        defaultActiveLayers={defaultLayers}
      >
        <Map />
      </MapProvider>
    </AppLayoutCarto>
  );
};

export default OrganizationMapPage;
