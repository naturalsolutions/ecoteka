import React, { Fragment, memo, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { Navigation } from '../types';
import useApi from '../core/useApi';

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const api = useApi({ navigation });
  const [isLoading, setIsLoading] = useState(false);

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setIsLoading(true);

    const body = new FormData();
    body.append('username', email.value);
    body.append('password', password.value);

    try {
      const response = await fetch(
        'http://192.168.0.225:8000/api/v1/auth/login',
        {
          method: 'post',
          body,
        }
      );
      const payload = await response.json();
      console.log(response.status);
      console.log(payload);
      if (response.status != 200) {
        setTimeout(() => {
          setIsLoading(false);
        });
        return;
      }

      await api.setTokens(payload.access_token, payload.refresh_token);

      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Fragment>
      <Background>
        {/* <BackButton goBack={() => navigation.navigate('HomeScreen')} /> */}

        <Logo />

        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text style={styles.label}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={_onLoginPressed}>
          Login
        </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Don’t have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </Background>
      {isLoading && (
        <View style={styles.loadingFullscreen}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
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

export default memo(LoginScreen);
