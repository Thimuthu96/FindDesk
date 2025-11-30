import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainAppParamList } from '../navigation/RootNavigator';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';
import { ReportItem } from '../components/ReportItem';
import { BottomTabBar } from '../components/BottomTabBar';

type ReportsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainAppParamList, 'Reports'>,
  NativeStackScreenProps<RootStackParamList>['navigation']
>;

interface ReportsScreenProps {
  navigation: ReportsScreenNavigationProp;
  route: any;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ route, navigation }) => {
  const { userName } = route.params;
  const [activeTab, setActiveTab] = useState<'Home' | 'Reports' | 'Profile'>('Reports');

  const handleTabPress = (tab: 'Home' | 'Reports' | 'Profile') => {
    setActiveTab(tab);
    if (tab !== 'Reports') {
      (navigation as any).jumpTo(tab);
    }
  };

  // Sample reports data
  const allReports = [
    {
      id: '1',
      title: 'Missing brown leather wallet',
      location: 'No.123/A, Area 51, Science building',
      time: 'Just Now',
      status: 'Lost' as const,
    },
    {
      id: '2',
      title: 'Lost my wallet with phone ne...',
      location: 'No.123/A, Area 51, Science building',
      time: '1 hour ago',
      status: 'Lost' as const,
    },
    {
      id: '3',
      title: 'Missing black leather wallet',
      location: 'No.123/A, Area 51, Science building',
      time: '2 hours ago',
      status: 'Lost' as const,
    },
    {
      id: '4',
      title: 'Lost my wallet near the cant...',
      location: 'No.123/A, Area 51, Science building',
      time: '3 hours ago',
      status: 'Lost' as const,
    },
    {
      id: '5',
      title: 'Lost my wallet near the cant...',
      location: 'No.123/A, Area 51, Science building',
      time: '3 hours ago',
      status: 'Lost' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Reports</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🔽</Text>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reports Count */}
        <View style={styles.countSection}>
          <Text style={styles.countText}>{allReports.length} reports</Text>
        </View>

        {/* Reports List */}
        <View style={styles.reportsContainer}>
          {allReports.map((report) => (
            <ReportItem
              key={report.id}
              title={report.title}
              location={report.location}
              time={report.time}
              status={report.status}
              onPress={() => {
                // Navigate to report detail screen when available
              }}
            />
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.lightGray,
  },
  filterIcon: {
    marginRight: Spacing.sm,
    fontSize: 14,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  countSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  countText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  reportsContainer: {
    paddingHorizontal: Spacing.lg,
  },
});

export default ReportsScreen;
