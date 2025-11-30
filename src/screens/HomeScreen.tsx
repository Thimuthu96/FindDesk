import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import {
  RootStackParamList,
  MainAppParamList,
} from '../navigation/RootNavigator';
import { Colors, Spacing, Typography } from '../styles/constants';
import { ActivityCard } from '../components/ActivityCard';
import { ActionButton } from '../components/ActionButton';
import { ReportItem } from '../components/ReportItem';
import { BottomTabBar } from '../components/BottomTabBar';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainAppParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>['navigation']
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const { userName } = route.params;
  const [activeTab, setActiveTab] = useState<'Home' | 'Reports' | 'Profile'>(
    'Home',
  );

  const handleTabPress = (tab: 'Home' | 'Reports' | 'Profile') => {
    setActiveTab(tab);
    if (tab !== 'Home') {
      (navigation as any).jumpTo(tab);
    }
  };

  // Sample recent activity data
  const recentReports = [
    {
      id: '1',
      title: 'Missing brown leather wallet',
      location: 'No.123/A, Area 51, Science building',
      time: 'Just Now',
      status: 'Lost' as const,
      description:
        'Lost a black wallet with cash and cards. Last seen near Area 51. Kindly inform if found, urgent need.',
      postedBy: 'Thimuthu',
      userImage: 'https://via.placeholder.com/150',
      itemDetails: 'Black leather wallet with cash and ID cards',
      coordinates: '6.9271° N, 80.7789° E',
    },
    {
      id: '2',
      title: 'Lost my wallet with phone ne...',
      location: 'No.123/A, Area 51, Science building',
      time: '1 hour ago',
      status: 'Lost' as const,
      description:
        'Lost a brown wallet with important documents and phone case near the science building.',
      postedBy: 'John',
      userImage: 'https://via.placeholder.com/150',
      itemDetails: 'Brown leather wallet with phone case',
      coordinates: '6.9271° N, 80.7789° E',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.greeting}>Good morning, {userName}</Text>
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.activityContainer}>
            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate('MyActiveReports', { userName });
              }}
            >
              <ActivityCard
                iconName="info-outline"
                number="1"
                label="Active reports"
                containerStyle={{ marginLeft: 0 }}
              />
            </TouchableOpacity>
            <ActivityCard
              iconName="check-circle-outline"
              number="1"
              label="Resolved"
              containerStyle={{ marginHorizontal: Spacing.sm }}
            />
            <ActivityCard
              iconName="file-document-outline"
              number="5"
              label="Total reports"
              containerStyle={{ marginRight: 0 }}
            />
          </View>
        </View>

        {/* Report Item CTA */}
        <View style={styles.section_banner}>
          <ActionButton
            iconName="search"
            title="Lost Something?"
            subtitle="Report it here and let the community help you find it. Or help others by reporting items you've found."
            variant="secondary"
            onPress={() => {
              // Navigate to report creation screen when available
            }}
          />
        </View>

        {/* Report New Item CTA */}
        <View style={styles.section}>
          <ActionButton
            iconName="add-circle"
            title="Report Item"
            subtitle="Report a lost or found item"
            variant="primary"
            onPress={() => {
              (navigation as any).navigate('MakeLostReport');
            }}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => handleTabPress('Reports')}>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>

          {recentReports.map(report => (
            <ReportItem
              key={report.id}
              title={report.title}
              location={report.location}
              time={report.time}
              status={report.status}
              onPress={() => {
                (navigation as any).navigate('ReportInfo', { report });
              }}
            />
          ))}
        </View>
      </ScrollView>

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
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  section_banner: {
    paddingHorizontal: Spacing.lg,
    // marginVertical: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    // marginVertical: Spacing.lg,
    // marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  seeMoreText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  activityContainer: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
});

export default HomeScreen;
