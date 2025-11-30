import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

interface ActivityCardProps {
  iconName: string;
  number: string | number;
  label: string;
  containerStyle?: ViewStyle;
}

// const ICON_MAP: { [key: string]: string } = {
//   'error-outline': '⚠️',
//   'check-circle': '✅',
//   'description': '📋',
// };

export const ActivityCard: React.FC<ActivityCardProps> = ({
  iconName,
  number,
  label,
  containerStyle,
}) => {
  

  return (
    <View style={[styles.card, containerStyle]}>
          {/* <Text style={styles.icon}>{icon}</Text> */}
        <MaterialIcons name={iconName as any} size={28} color={Colors.primary} style={styles.icon} />
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  icon: {
    fontSize: 28,
    marginBottom: Spacing.md,
  },
  number: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
