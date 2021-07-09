import { FC, useState } from "react";
import { makeStyles, Theme, useTheme, useMediaQuery } from "@material-ui/core";
import MapProvider from "@/components/Map/Provider";
import OSMLayer, {
  renderTooltipInfo as renderTooltipInfoOSM,
} from "@/components/Map/Layers/OSM";
import HomeHeroSearchCity from "@/components/Home/HeroSearchCity";

export interface HomeHeroProps {}

const useStyles = makeStyles<Theme, { coords: [] }>((theme: Theme) => ({
  root: {
    position: "relative",
    height: "calc(100vh - 200px)",
  },
  map: {
    top: 223,
    left: 0,
    height: "calc(100% - 223px)",
    width: "100%",
    position: "relative",
  },
  [theme.breakpoints.up("sm")]: {
    map: {
      top: 0,
      height: "100%",
    },
  },
}));

const rendersTooltip = {
  osm: renderTooltipInfoOSM,
};

const HomeHero: FC<HomeHeroProps> = ({}) => {
  const [coords, setCoords] = useState();
  const [info, setInfo] = useState<Record<string, any>>({});
  const classes = useStyles({ coords });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleShowInfoLayer = (newInfo) => {
    setInfo(undefined);

    if (newInfo.picked) {
      setInfo(newInfo);
    }
  };

  const osmLayer = OSMLayer({ visible: true, onHover: handleShowInfoLayer });

  const handleOnChangeCity = (coords) => {
    setCoords(coords);
  };

  return (
    <div className={classes.root}>
      {isMobile && (
        <HomeHeroSearchCity coords={coords} onChangeCity={handleOnChangeCity} />
      )}
      <MapProvider
        PaperProps={{ elevation: 0, className: classes.map }}
        layers={[osmLayer]}
      >
        {!isMobile && (
          <HomeHeroSearchCity
            coords={coords}
            onChangeCity={handleOnChangeCity}
          />
        )}
      </MapProvider>
      {info?.layer?.id &&
        rendersTooltip[info.layer.id] &&
        rendersTooltip[info.layer.id]({ info })}
    </div>
  );
};

export default HomeHero;
