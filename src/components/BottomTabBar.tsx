import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

// import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Colors, Spacing, Typography } from '../styles/constants';

interface BottomTabBarProps {
  activeTab: 'Home' | 'Reports' | 'Profile';
  onTabPress: (tab: 'Home' | 'Reports' | 'Profile') => void;
  containerStyle?: ViewStyle;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
  containerStyle,
}) => {
  const isActive = (tab: string) => activeTab === tab;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* HOME TAB */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabPress('Home')}
      >
        <MaterialIcons
          name="home"
          size={isActive('Home') ? 30 : 26}
          color={isActive('Home') ? Colors.primary : Colors.textTertiary}
        />
        <Text style={[styles.tabLabel, isActive('Home') && styles.activeLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* REPORTS TAB */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabPress('Reports')}
      >
        <MaterialIcons
          name="insert-chart"
          size={isActive('Reports') ? 30 : 26}
          color={isActive('Reports') ? Colors.primary : Colors.textTertiary}
        />
        <Text
          style={[styles.tabLabel, isActive('Reports') && styles.activeLabel]}
        >
          Reports
        </Text>
      </TouchableOpacity>

      {/* PROFILE TAB */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabPress('Profile')}
      >
        <MaterialIcons
          name="person"
          size={isActive('Profile') ? 30 : 26}
          color={isActive('Profile') ? Colors.primary : Colors.textTertiary}
        />
        <Text
          style={[styles.tabLabel, isActive('Profile') && styles.activeLabel]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.medium,
    marginTop: 4,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
});
