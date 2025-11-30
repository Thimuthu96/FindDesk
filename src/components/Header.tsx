import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
  containerStyle?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightButton,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightButton && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightButton.onPress}
        >
          <Text style={styles.rightButtonIcon}>{rightButton.icon}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: Spacing.md,
    marginLeft: -Spacing.md,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  rightButton: {
    padding: Spacing.md,
  },
  rightButtonIcon: {
    fontSize: 20,
  },
});
