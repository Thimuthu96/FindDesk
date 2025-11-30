import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Image
        source={require('../../assets/images/logo/splash_logo.png')}
        style={[
          styles.logo,
          {
            width: width * 0.6,
            height: (width * 0.6 * 256) / 256, // Maintain aspect ratio
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    marginBottom: 20,
  },
});

export default SplashScreen;
