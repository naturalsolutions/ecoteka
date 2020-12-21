import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/logo.svg')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 50,
    marginBottom: 12,
  },
});

export default memo(Logo);
