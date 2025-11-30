import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ReportInfoScreen from '../screens/ReportInfoScreen';
import MakeLostReportScreen from '../screens/MakeLostReportScreen';
import MakeFoundReportScreen from '../screens/MakeFoundReportScreen';
import MyActiveReportsScreen from '../screens/MyActiveReportsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: { userName?: string };
  SignUp: undefined;
  MainApp: { userName: string };
  ReportInfo: { report: any };
  MakeLostReport: undefined;
  MakeFoundReport: { relatedReport?: any };
  MyActiveReports: { userName: string };
};

export type MainAppParamList = {
  Home: { userName: string };
  Reports: { userName: string };
  Profile: { userName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator<MainAppParamList>();

const MainAppNavigator: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar as we use custom BottomTabBar
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userName }}
      />
      <BottomTab.Screen
        name="Reports"
        component={ReportsScreen}
        initialParams={{ userName }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userName }}
      />
    </BottomTab.Navigator>
  );
};

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen
          name="MainApp"
          children={({ route }) => (
            <MainAppNavigator userName={route.params?.userName || 'User'} />
          )}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen
          name="ReportInfo"
          component={ReportInfoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MakeLostReport"
          component={MakeLostReportScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MakeFoundReport"
          component={MakeFoundReportScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyActiveReports"
          component={MyActiveReportsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
