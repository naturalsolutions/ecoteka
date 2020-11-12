import React, { useEffect, useState } from "react";
import {
  Grid
} from "@material-ui/core";
import { ETKPanelProps } from "@/components/Panel";
import PanelStartGeneralInfo from "@/components/Panel/Start/GeneralInfo";
import PanelStartTreeInfo from "@/components/Panel/Start/TreeInfo";
import Welcome from "@/components/Panel/Start/Welcome";
import { useAppContext } from "@/providers/AppContext";

const ETKPanelStartPanel: React.FC<ETKPanelProps> = (props) => {
  const [info, setInfo] = useState(false)
  const [tree, setTree] = useState()
  const [coordinates, setCoordinates] = useState()
  const { user } = useAppContext();

  const onClick = (e) => {
    const rendererFeatures = props.context?.map?.current?.map?.queryRenderedFeatures(e.point)
    let features = []

    if (rendererFeatures) {
      features = rendererFeatures?.filter((f) => {
        return f.layer['source-layer'].includes('ecoteka')
      })

      if (features.length > 0) {
        const feature = features.pop()

        setTree(feature.properties)
        setCoordinates(feature.geometry.coordinates)
        setInfo(true)
      }
    }
  }

  useEffect(() => {
    props.context?.map?.current?.map?.on('click', onClick)

    return () => {
      props.context?.map?.current?.map?.off('click', onClick)
    }
  }, [props?.context?.map?.current])

  return (
    <Grid container direction="column" spacing={3}>
      { !user && !info && <Grid item><Welcome /></Grid>}
      { user && !info && <Grid item><PanelStartGeneralInfo /></Grid>}
      { info && <Grid item><PanelStartTreeInfo tree={tree} coordinates={coordinates} onClose={() => setInfo(false)} /></Grid>}
    </Grid>);
};

export default ETKPanelStartPanel;
