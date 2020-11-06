import React, { useEffect, useState } from "react";
import {
  Grid,
  Tabs,
  Tab,
} from "@material-ui/core";
import { ETKPanelProps } from "@/components/Panel";
import PanelStartGeneralInfo from "@/components/Panel/Start/GeneralInfo";
import PanelStartTreeInfo from "@/components/Panel/Start/TreeInfo";
import { useAppContext } from "@/providers/AppContext";

const ETKPanelStartPanel: React.FC<ETKPanelProps> = (props) => {
  const [index, setIndex] = useState(0)
  const [tree, setTree] = useState()
  const [coordinates, setCoordinates] = useState()

  const onClick = (e) => {
    const rendererFeatures = props.context?.map?.current?.map?.queryRenderedFeatures(e.point)
    const features = rendererFeatures.filter((f) => {
      return f.layer['source-layer'].includes('ecoteka')
    })

    if (features.length > 0) {
      const feature = features.pop()

      setTree(feature.properties)
      setCoordinates(feature.geometry.coordinates)
      setIndex(1)
    }
  }

  useEffect(() => {
    props.context?.map?.current?.map?.on('click', onClick)

    return () => {
      props.context?.map?.current?.map?.off('click', onClick)
    }
  }, [])

  return (
    <Grid container direction="column" spacing={3}>
      <Tabs centered value={index} onChange={(e, newValue) => setIndex(newValue)}>
        <Tab label="Start"></Tab>
        <Tab label="Tree Info"></Tab>
      </Tabs>
      { 0 === index && <Grid item><PanelStartGeneralInfo /></Grid>}
      { 1 === index && <Grid item><PanelStartTreeInfo tree={tree} coordinates={coordinates} /></Grid>}
    </Grid>
  );
};

export default ETKPanelStartPanel;
