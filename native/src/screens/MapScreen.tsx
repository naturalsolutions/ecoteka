import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';

import { Navigation } from '../types';
import useApi from '../core/useApi';
import * as Location from 'expo-location';

type MapScreenProps = {
  navigation: Navigation;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const MapScreen = ({ navigation }: MapScreenProps) => {
  const api = useApi({ navigation });
  const [position, setPosition] = useState({
    latitude: undefined,
    longitude: undefined,
  });
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef();

  const getLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Permission to access location was denied',
        [{ text: 'OK' }]
      );
      return;
    }

    let location = await Location.getLastKnownPositionAsync({
      maxAge: 1000 * 30, // TODO
    });
    if (!location) {
      location = await Location.getCurrentPositionAsync({});
    }

    return location;
  };

  const getCurrentPosition = async () => {
    const location = await getLocation();
    if (!location) {
      console.log(location);
      setPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(position);
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef} region={region}>
        {position.latitude && position.longitude && (
          <Marker coordinate={position} />
        )}
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
      </MapView>
    </View>
  );
};

export default MapScreen;
