import React, { Fragment, memo, useState } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from '../components/BackButton';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import useApi from '../core/useApi';
import { theme } from '../core/theme';
import * as Location from 'expo-location';
import { Snackbar } from 'react-native-paper';

type Props = {
  navigation: Navigation;
};

const styles = StyleSheet.create({
  loadingFullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,.8)',
  },
});

const TreeCreationScreen = ({ navigation }: Props) => {
  const api = useApi({ navigation });
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const pickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    quality: 0.8,
  };

  const pick = async (from: 'library' | 'camera') => {
    console.log('pick !');
    setIsLoading(true);
    const result = await {
      camera: ImagePicker.launchCameraAsync,
      library: ImagePicker.launchImageLibraryAsync,
    }[from](pickerOptions);

    if (result.cancelled) {
      setIsLoading(false);
      return;
    }

    setImageUri(result.uri);
    setIsLoading(false);
  };

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

  const createTree = async (session, payload) => {
    try {
      const response = await session.apiETK.post(
        '/organization/1/trees/',
        payload
      );
      return response.data;
    } catch (error) {
      console.log('post tree error', error);
      return;
    }
  };

  const send = async () => {
    try {
      const session = await api.getSession();
      if (!session) {
        return;
      }

      setIsLoading(true);

      const location = await getLocation();
      if (!location) {
        return setIsLoading(false);
      }

      const tree = await createTree(session, {
        x: location.coords.longitude,
        y: location.coords.latitude,
      });
      if (!tree) {
        return setIsLoading(false);
      }

      const filename = imageUri.split('/').pop();

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('images', {
        uri:
          Platform.OS === 'android'
            ? imageUri
            : imageUri.replace('file://', ''),
        name: filename,
        type,
      });

      const response = await session.apiETK.post(
        `/organization/1/trees/${tree.id}/images`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            console.log(e);
          },
        }
      );

      setIsLoading(false);
      setIsSent(true);
      setIsSuccessVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    setImageUri(null);
    setIsSent(false);
  };

  const renderSelectPicker = () => {
    return (
      <Fragment>
        <Paragraph>Prendre une photo de l'arbre</Paragraph>
        <Button mode="outlined" onPress={() => pick('library')}>
          Parcourir
        </Button>
        <Button mode="outlined" onPress={() => pick('camera')}>
          Appareil photo
        </Button>
      </Fragment>
    );
  };

  const renderHasImage = () => {
    return (
      <Fragment>
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
        {isSent ? (
          <Button mode="outlined" onPress={() => reset()}>
            Ajouter un autre arbre
          </Button>
        ) : (
          <Fragment>
            <Button mode="outlined" onPress={() => send()}>
              Envoyer
            </Button>
            <Button
              onPress={() => {
                setImageUri(null);
              }}
            >
              Annuler
            </Button>
          </Fragment>
        )}
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Background>
        <BackButton goBack={() => navigation.navigate('Dashboard')} />
        <Logo />
        <Header>Ajouter un arbre</Header>
        {!imageUri ? renderSelectPicker() : renderHasImage()}
        <Snackbar
          visible={isSuccessVisible}
          duration={2000}
          onDismiss={() => setIsSuccessVisible(false)}
        >
          Arbre ajouté
        </Snackbar>
      </Background>
      {isLoading && (
        <View style={styles.loadingFullscreen}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </Fragment>
  );
};

export default memo(TreeCreationScreen);
