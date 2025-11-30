import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  RootStackParamList,
  MainAppParamList,
} from '../navigation/RootNavigator';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';
import { ReportItem } from '../components/ReportItem';
import { BottomTabBar } from '../components/BottomTabBar';

type MyActiveReportsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainAppParamList, 'Reports'>,
  NativeStackScreenProps<RootStackParamList>['navigation']
>;

interface MyActiveReportsScreenProps {
  navigation: MyActiveReportsScreenNavigationProp;
  route: any;
}

interface FoundItem {
  id: string;
  foundBy: string;
  foundByImage?: string;
  itemImage?: any;
  description: string;
  location: string;
  foundDate: string;
}

const MyActiveReportsScreen: React.FC<MyActiveReportsScreenProps> = ({
  route,
  navigation,
}) => {
  const { userName } = route.params;
  const [activeTab, setActiveTab] = useState<'Home' | 'Reports' | 'Profile'>(
    'Reports',
  );
  const [showVerificationSheet, setShowVerificationSheet] = useState(false);
  const [selectedFound, setSelectedFound] = useState<FoundItem | null>(null);

  const handleTabPress = (tab: 'Home' | 'Reports' | 'Profile') => {
    setActiveTab(tab);
    if (tab !== 'Reports') {
      (navigation as any).jumpTo(tab);
    }
  };

  // Active reports with found items
  const activeReports = [
    {
      id: '1',
      title: 'Missing brown leather wallet',
      location: 'No.123/A, Area 51, Science building',
      time: 'Just Now',
      status: 'Lost' as const,
      description:
        'Lost a black wallet with cash and cards. Last seen near Area 51. Kindly inform if found, urgent need.',
      postedBy: 'Thimuthu',
      itemDetails: 'Black leather wallet with cash and ID cards',
      foundItem: {
        id: 'found_1',
        foundBy: 'Thimuthu test',
        foundByImage: 'https://via.placeholder.com/150',
        itemImage: require('../../assets/images/logo/wallet.png'),
        description:
          'Lost a black wallet with cash and cards. Last seen near Area 51. Kindly inform if found, urgent need. Missing leather wallet containing ID and money. Last spotted around Area 51. Please help recover.',
        location: 'Athunugiriya Interchange',
        foundDate: 'Just Now',
      } as FoundItem,
    },
  ];

  const openVerificationSheet = (foundItem: FoundItem) => {
    setSelectedFound(foundItem);
    setShowVerificationSheet(true);
  };

  const handleVerifyOwnership = () => {
    if (selectedFound) {
      Alert.alert(
        'Success',
        'Your ownership has been verified! You can now collect the item from the finder.',
        [
          {
            text: 'Contact Finder',
            onPress: () => {
              setShowVerificationSheet(false);
              Alert.alert(
                'Contacting',
                `Opening contact dialog for ${selectedFound.foundBy}`,
              );
            },
          },
          {
            text: 'Close',
            onPress: () => setShowVerificationSheet(false),
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My active reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Reports */}
        {activeReports.map(report => (
          <View key={report.id} style={styles.reportSection}>
            {/* Report Card */}
            <ReportItem
              title={report.title}
              location={report.location}
              time={report.time}
              status={report.status}
              onPress={() => {
                (navigation as any).navigate('ReportInfo', { report });
              }}
            />

            {/* Found Message */}
            {report.foundItem && (
              <View style={styles.foundMessageContainer}>
                <View style={styles.foundMessageContent}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#2E7D32"
                    style={styles.checkIcon}
                  />
                  <Text style={styles.foundMessageText}>
                    Item has found! Confirm your ownership and collect the item
                  </Text>
                </View>
              </View>
            )}

            {/* Found By Card */}
            {report.foundItem && (
              <View style={styles.foundByCard}>
                <View style={styles.foundByHeader}>
                  <Text style={styles.foundByLabel}>found by</Text>
                </View>

                {/* Founder Avatar */}
                <View style={styles.founderSection}>
                  <View style={styles.founderAvatar}>
                    <Text style={styles.avatarText}>
                      {report.foundItem.foundBy.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.founderName}>
                    {report.foundItem.foundBy}
                  </Text>
                </View>

                {/* Item Image */}
                <View style={styles.itemImageContainer}>
                  {report.foundItem.itemImage && (
                    <Image
                      source={report.foundItem.itemImage}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                  )}
                </View>

                {/* Item Info */}
                <View style={styles.itemInfoSection}>
                  <Text style={styles.itemInfoTitle}>Item Information</Text>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={18}
                      color={Colors.primary}
                      style={styles.infoIcon}
                    />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Found Location</Text>
                      <Text style={styles.infoValue}>
                        {report.foundItem.location}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={18}
                      color={Colors.primary}
                      style={styles.infoIcon}
                    />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Found Date</Text>
                      <Text style={styles.infoValue}>
                        {report.foundItem.foundDate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {report.foundItem.description}
                    </Text>
                  </View>
                </View>

                {/* Verify Ownership Button */}
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => openVerificationSheet(report.foundItem!)}
                >
                  <Text style={styles.verifyButtonText}>Verify ownership</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Empty State */}
        {activeReports.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="inbox"
              size={64}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>No active reports yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Verification Bottom Sheet */}
      <Modal
        visible={showVerificationSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVerificationSheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.bottomSheet}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Verify Ownership</Text>
              <TouchableOpacity onPress={() => setShowVerificationSheet(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.sheetContent}>
              <Text style={styles.sheetDescription}>
                To verify your ownership, please answer the security questions
                below:
              </Text>

              {/* Question 1 */}
              <View style={styles.questionSection}>
                <Text style={styles.questionLabel}>Question 1</Text>
                <Text style={styles.questionText}>
                  What color is the wallet?
                </Text>
                <View style={styles.answerInput}>
                  <Text style={styles.answerPlaceholder}>
                    Type your answer...
                  </Text>
                </View>
              </View>

              {/* Question 2 */}
              <View style={styles.questionSection}>
                <Text style={styles.questionLabel}>Question 2</Text>
                <Text style={styles.questionText}>
                  What documents are inside?
                </Text>
                <View style={styles.answerInput}>
                  <Text style={styles.answerPlaceholder}>
                    Type your answer...
                  </Text>
                </View>
              </View>

              {/* Question 3 */}
              <View style={styles.questionSection}>
                <Text style={styles.questionLabel}>Question 3</Text>
                <Text style={styles.questionText}>
                  What was the approximate amount of cash?
                </Text>
                <View style={styles.answerInput}>
                  <Text style={styles.answerPlaceholder}>
                    Type your answer...
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowVerificationSheet(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleVerifyOwnership}
              >
                <Text style={styles.confirmButtonText}>Verify & Collect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  reportSection: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  foundMessageContainer: {
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: BorderRadius.large,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  foundMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: Spacing.md,
  },
  foundMessageText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 20,
  },
  foundByCard: {
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  foundByHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  foundByLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  founderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  founderAvatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  founderName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  itemImageContainer: {
    height: 280,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  itemImage: {
    width: '100%',
    height: 250,
  },
  itemInfoSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  itemInfoTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  infoIcon: {
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  descriptionSection: {
    marginTop: Spacing.lg,
  },
  descriptionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  descriptionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  verifyButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  // Bottom Sheet Styles
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    paddingTop: Spacing.md,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  sheetContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sheetDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  questionSection: {
    marginBottom: Spacing.lg,
  },
  questionLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.lightGrayBg,
  },
  answerPlaceholder: {
    fontSize: Typography.fontSize.sm,
    color: Colors.placeholder,
  },
  sheetActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
});

export default MyActiveReportsScreen;
