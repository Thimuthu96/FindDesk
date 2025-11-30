import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ActionButtonProps {
  iconName: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  variant?: 'primary' | 'secondary';
}

// const ICON_MAP: { [key: string]: string } = {
//   'search': '🔍',
//   'add-circle': '➕',
//   'arrow-forward': '→',
// };

export const ActionButton: React.FC<ActionButtonProps> = ({
  iconName,
  title,
  subtitle,
  onPress,
  containerStyle,
  variant = 'primary',
}) => {
  const isPrimary = variant === 'primary';
  //   const icon = ICON_MAP[iconName] || '•';
  //   const arrowIcon = ICON_MAP['arrow-forward'] || '›';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPrimary ? styles.primaryContainer : styles.secondaryContainer,
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {/* <Text style={[styles.icon, isPrimary && styles.primaryIcon]}>
          {iconName}
        </Text> */}
        <MaterialIcons
          name={iconName as any}
          size={28}
          color={isPrimary ? Colors.background : Colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isPrimary && styles.primaryText]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, isPrimary && styles.primarySubtitle]}>
          {subtitle}
        </Text>
      </View>
      {/* <Text style={[styles.arrow, isPrimary && styles.primaryArrow]}>
        {arrowIcon}
      </Text> */}
      <MaterialIcons
        name="arrow-forward"
        size={24}
        color={isPrimary ? Colors.background : Colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  secondaryContainer: {
    backgroundColor: Colors.primaryLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  icon: {
    fontSize: 24,
    color: Colors.primary,
  },
  primaryIcon: {
    color: Colors.background,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  primaryText: {
    color: Colors.background,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  primarySubtitle: {
    color: Colors.background,
  },
  arrow: {
    fontSize: 24,
    color: Colors.text,
    marginLeft: Spacing.lg,
  },
  primaryArrow: {
    color: Colors.background,
  },
});
