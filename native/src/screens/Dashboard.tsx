import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import useApi from '../core/useApi';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const api = useApi({ navigation });
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favourite code editor and start
        editing this project.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('TreeCreationScreen')}
      >
        Ajouter un arbre
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate('MapScreen')}>
        Vue Carte
      </Button>
      <Button mode="outlined" onPress={() => api.logout()}>
        Déconnexion
      </Button>
    </Background>
  );
};

export default memo(Dashboard);
