import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
// import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    checkAndRequestLocation();
  }, []);

  const checkAndRequestLocation = async () => {
    const permission = await requestLocationPermission();
    if (permission) {
      // Add a small delay to let permission state propagate
      setTimeout(() => {
        getCurrentLocation();
      }, 500);
    }
  };

  // -------- PERMISSION HANDLING -------- //
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (result === RESULTS.GRANTED) {
          console.log('📍 Location permission granted');
          return true;
        } else {
          console.log('📍 Location permission denied');
          return false;
        }
      } else {
        // iOS
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission Error:', err);
      return false;
    }
  };

  // -------- FETCH CURRENT LOCATION -------- //
  const getCurrentLocation = () => {
    // Geolocation.getCurrentPosition(
    //   pos => {
    //     setLocation(pos.coords);
    //     console.log('📍 Current Location:', pos.coords);
    //   },
    //   err => console.log('❌ Location Error:', err),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    // );

    Geolocation.getCurrentPosition(info => console.log(info));
  };

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
