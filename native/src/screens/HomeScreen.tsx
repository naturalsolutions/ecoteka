import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import { Navigation } from '../types';
import useApi from '../core/useApi';

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => {
  setTimeout(async () => {
    try {
      const session = await useApi({ navigation }).getSession();
      if (session) {
        navigation.navigate('Dashboard');
      }
    } catch (error) {}
  }, 750);

  return (
    <Background>
      <Logo />
    </Background>
  );
};

export default memo(HomeScreen);
