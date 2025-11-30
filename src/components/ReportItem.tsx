import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

interface ReportItemProps {
  image?: string;
  title: string;
  location: string;
  time: string;
  status?: 'Lost' | 'Found' | 'Resolved';
  onPress?: () => void;
  containerStyle?: ViewStyle;
}

export const ReportItem: React.FC<ReportItemProps> = ({
  image,
  title,
  location,
  time,
  status,
  onPress,
  containerStyle,
}) => {
  const getStatusBackgroundColor = () => {
    switch (status) {
      case 'Lost':
        return '#FFE8E8';
      case 'Found':
        return '#E8F5E9';
      case 'Resolved':
        return '#E3F2FD';
      default:
        return Colors.primaryLight;
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'Lost':
        return '#FF4444';
      case 'Found':
        return '#44AA44';
      case 'Resolved':
        return '#0066FF';
      default:
        return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={require('../../assets/images/logo/wallet.png')}
        style={[styles.image, { width: 100, height: 100 }]}
        resizeMode="contain"
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {status && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackgroundColor() },
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusTextColor() }]}
              >
                {status}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.icon}>🕐</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    alignItems: 'flex-start',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.medium,
    marginRight: Spacing.lg,
    backgroundColor: Colors.border,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    marginRight: Spacing.sm,
    fontSize: 14,
  },
  location: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
  time: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
});
