import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

interface ActivityCardProps {
  iconName: string;
  number: string | number;
  label: string;
  containerStyle?: ViewStyle;
  iconColor?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  iconName,
  iconColor = Colors.primary,
  number,
  label,
  containerStyle,
}) => {
  return (
    <View style={[styles.card, containerStyle]}>
      <MaterialIcons
        name={iconName}
        size={28}
        color={iconColor}
        style={styles.icon}
      />

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
