import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

type ReportInfoScreenProps = NativeStackScreenProps<any, 'ReportInfo'>;

interface ReportData {
  id: string;
  title: string;
  location: string;
  time: string;
  status: 'Lost' | 'Found';
  description: string;
  image?: string;
  postedBy: string;
  userImage?: string;
  coordinates?: string;
  itemDetails?: string;
}

interface RelatedItem {
  id: string;
  title: string;
  location: string;
  status: 'Lost' | 'Found';
  postedBy: string;
}

const RELATED_ITEMS: RelatedItem[] = [
  {
    id: '1',
    title: 'Black Leather Wallet',
    location: 'Near Shopping Mall',
    status: 'Lost',
    postedBy: 'John',
  },
  {
    id: '2',
    title: 'Blue Travel Bag',
    location: 'Bus Station',
    status: 'Found',
    postedBy: 'Sarah',
  },
  {
    id: '3',
    title: 'Silver Watch',
    location: 'Airport Lounge',
    status: 'Lost',
    postedBy: 'Mike',
  },
  {
    id: '4',
    title: 'Car Keys with Keychain',
    location: 'Parking Area',
    status: 'Found',
    postedBy: 'Emma',
  },
];

const ReportInfoScreen: React.FC<ReportInfoScreenProps> = ({
  navigation,
  route,
}) => {
  const { report } = route.params as { report: ReportData };
  const [isItemFound, setIsItemFound] = useState(false);

  const getStatusBackgroundColor = () => {
    switch (report.status) {
      case 'Lost':
        return '#FFE8E8';
      case 'Found':
        return '#E8F5E9';
      default:
        return Colors.primaryLight;
    }
  };

  const getStatusTextColor = () => {
    switch (report.status) {
      case 'Lost':
        return '#FF4444';
      case 'Found':
        return '#44AA44';
      default:
        return Colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={Colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Info</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Item Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/logo/wallet.png')}
            style={styles.itemImage}
            resizeMode="contain"
          />
        </View>

        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <View style={styles.userAvatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {report.postedBy.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.postedByLabel}>posted by</Text>
              <Text style={styles.userName}>{report.postedBy}</Text>
            </View>
          </View>
        </View>

        {/* Title and Status */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackgroundColor() },
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusTextColor() }]}
              >
                {report.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Item Details */}
        <View style={styles.detailsSection}>
          {/* Time */}
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color={Colors.primary}
              style={styles.detailIcon}
            />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{report.time}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={24}
              color={Colors.primary}
              style={styles.detailIcon}
            />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{report.location}</Text>
            </View>
          </View>

          {/* Item Details if available */}
          {report.itemDetails && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="package-outline"
                size={24}
                color={Colors.primary}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Item Details</Text>
                <Text style={styles.detailValue}>{report.itemDetails}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{report.description}</Text>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Report Status</Text>
            <Text style={styles.infoCardValue}>
              {report.status === 'Lost' ? 'Still searching' : 'Item found'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Contact</Text>
            <Text style={styles.infoCardValue}>Available on request</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {!isItemFound && report.status === 'Lost' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.foundButton]}
                onPress={() => {
                  (navigation as any).navigate('MakeFoundReport', {
                    relatedReport: report,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={Colors.background}
                  style={styles.buttonIcon}
                />
                <Text style={styles.foundButtonText}>Item has found</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={Colors.primary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.contactButtonText}>Contact Poster</Text>
              </TouchableOpacity>
            </>
          )}

          {report.status === 'Found' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.contactButton]}
            >
              <MaterialCommunityIcons
                name="hand-right"
                size={20}
                color={Colors.primary}
                style={styles.buttonIcon}
              />
              <Text style={styles.contactButtonText}>Claim Your Item</Text>
            </TouchableOpacity>
          )}

          {isItemFound && (
            <View style={styles.successMessage}>
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#2E7D32"
                style={styles.successIcon}
              />
              <Text style={styles.successText}>Thank you for reporting</Text>
            </View>
          )}
        </View>

        {/* Related Items Section */}
        <View style={styles.relatedItemsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.relatedItemsTitle}>Related Items</Text>
            <MaterialCommunityIcons
              name="tag-multiple"
              size={20}
              color={Colors.primary}
            />
          </View>

          <FlatList
            data={RELATED_ITEMS}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.relatedItemCard}
                onPress={() => {
                  navigation.push('ReportInfo', {
                    report: { ...item, time: 'Today' } as any,
                  });
                }}
              >
                <View style={styles.relatedItemImage}>
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={32}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.relatedItemContent}>
                  <Text style={styles.relatedItemTitle}>{item.title}</Text>

                  <View style={styles.relatedItemInfo}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={14}
                      color={Colors.textSecondary}
                      style={styles.relatedItemIcon}
                    />
                    <Text style={styles.relatedItemLocation}>
                      {item.location}
                    </Text>
                  </View>

                  <View style={styles.relatedItemFooter}>
                    <Text style={styles.relatedItemPostedBy}>
                      by {item.postedBy}
                    </Text>
                    <View
                      style={[
                        styles.relatedItemStatus,
                        {
                          backgroundColor:
                            item.status === 'Lost' ? '#FFE8E8' : '#E8F5E9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.relatedItemStatusText,
                          {
                            color:
                              item.status === 'Lost'
                                ? '#FF4444'
                                : item.status === 'Found'
                                ? '#44AA44'
                                : Colors.primary,
                          },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: 250,
  },
  userInfoCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  userAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  userDetails: {
    flex: 1,
  },
  postedByLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  titleSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  reportTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  detailsSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.lightGrayBg,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  detailIcon: {
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  descriptionSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  descriptionText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  additionalSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: Colors.lightGrayBg,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  infoCardTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  infoCardValue: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
  actionButtonsContainer: {
    marginHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  foundButton: {
    backgroundColor: Colors.primary,
  },
  foundButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  contactButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  contactButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  successMessage: {
    backgroundColor: '#E8F5E9',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    flexDirection: 'row',
  },
  successIcon: {
    marginRight: Spacing.md,
  },
  successText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: '#2E7D32',
  },
  relatedItemsSection: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  relatedItemsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  relatedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrayBg,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  relatedItemImage: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  relatedItemContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  relatedItemTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  relatedItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  relatedItemIcon: {
    marginRight: Spacing.xs,
  },
  relatedItemLocation: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  relatedItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  relatedItemPostedBy: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  relatedItemStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.medium,
  },
  relatedItemStatusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
});

export default ReportInfoScreen;
