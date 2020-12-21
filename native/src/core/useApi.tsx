import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from '../types';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

type Props = {
  navigation: Navigation;
};

export default function useApi({ navigation }: Props) {
  const apiUrl = 'http://192.168.0.225:8000/api/v1/';
  let accessToken;
  let refreshToken;

  const setTokens = async (newAccessToken, newRefreshToken) => {
    if (newAccessToken) {
      await AsyncStorage.setItem('etkAccessToken', newAccessToken);
    }
    if (newRefreshToken) {
      await AsyncStorage.setItem('etkRefreshToken', newRefreshToken);
    }
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('etkAccessToken');
    await AsyncStorage.removeItem('etkRefreshToken');
    accessToken = null;
    refreshToken = null;
    navigation.navigate('LoginScreen');
  };

  const getSession = async () => {
    if ((!accessToken || !refreshToken) && typeof window !== 'undefined') {
      const sessionAccessToken = await AsyncStorage.getItem('etkAccessToken');
      const sessionRefreshToken = await AsyncStorage.getItem('etkRefreshToken');
      await setTokens(sessionAccessToken, sessionRefreshToken);
    }

    if ((!accessToken || !refreshToken) && typeof window !== 'undefined') {
      navigation.navigate('LoginScreen');
      return;
    }

    let ecotekaV1 = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // This Axios instance is private;
    // Use it only to get (or hope to get) a "/auth/refresh_token" successfull response
    let _ecotekaV1ForRefresh = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const refreshAuthLogic = (failedRequest) =>
      // We got here because accessToken has expired
      // Overwriting headers in failedRequest will not help us to get a "/auth/refresh_token" successfull response
      // We could have used Axios reponse interceptors to reset defaut Authorization header...
      // But we choose to use a dedicated Axios instance to make code clearer

      _ecotekaV1ForRefresh
        .post('/auth/refresh_token')
        .then(async (tokenRefreshResponse) => {
          const { access_token, refresh_token } = tokenRefreshResponse.data;
          await setTokens(access_token, refresh_token);
          failedRequest.response.config.headers[
            'Authorization'
          ] = `Bearer ${access_token}`;
          return Promise.resolve();
        })
        .catch((error) => {
          navigation.navigate('LoginScreen');
          return Promise.reject();
        });

    createAuthRefreshInterceptor(ecotekaV1, refreshAuthLogic, {
      statusCodes: [401, 422],
    });

    return {
      apiETK: ecotekaV1,
    };
  };

  return {
    getSession,
    setTokens,
    logout,
  };
}
