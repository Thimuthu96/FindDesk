import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainAppParamList } from '../navigation/RootNavigator';
import { Colors, Spacing, Typography } from '../styles/constants';
import { BottomTabBar } from '../components/BottomTabBar';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainAppParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>['navigation']
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const { userName } = route.params;
  const [activeTab, setActiveTab] = useState<'Home' | 'Reports' | 'Profile'>('Profile');

  const handleTabPress = (tab: 'Home' | 'Reports' | 'Profile') => {
    setActiveTab(tab);
    if (tab !== 'Profile') {
      (navigation as any).jumpTo(tab);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Placeholder Content */}
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>👤</Text>
          <Text style={styles.placeholderTitle}>Profile</Text>
          <Text style={styles.placeholderText}>
            Profile screen coming soon...
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  placeholderTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  placeholderText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProfileScreen;
