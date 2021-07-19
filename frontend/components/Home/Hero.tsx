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
    display: "flex",
    flexDirection: "column",
  },
  map: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    position: "relative",
  },
  [theme.breakpoints.up("md")]: {
    root: {
      display: "block",
    },
    map: {
      height: "calc(100vh - 200px)",
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
      <MapProvider
        startComponent={
          isMobile && (
            <HomeHeroSearchCity
              coords={coords}
              onChangeCity={handleOnChangeCity}
            />
          )
        }
        endComponent={
          !isMobile && (
            <HomeHeroSearchCity
              coords={coords}
              onChangeCity={handleOnChangeCity}
            />
          )
        }
        PaperProps={{ elevation: 0, className: classes.map }}
        layers={[osmLayer]}
      />
      {info?.layer?.id &&
        rendersTooltip[info.layer.id] &&
        rendersTooltip[info.layer.id]({ info })}
    </div>
  );
};

export default HomeHero;
