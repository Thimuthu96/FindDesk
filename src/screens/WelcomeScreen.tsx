import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const { width } = useWindowDimensions();

  const handleGetStarted = () => {
    if (userName.trim()) {
      // Navigate to Login screen
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/images/logo/welcome_logo.png')}
          style={[
            styles.logo,
            {
              width: width * 0.3,
              height: (width * 0.3 * 256) / 256,
            },
          ]}
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Welcome to FindDesk</Text>
        <Text style={styles.welcomeSubtitle}>
          Help reunite lost items with their owners. Let's start by getting to
          know you.
        </Text>

        {/* Name Input */}
        <Text style={styles.inputLabel}>What is your name or username?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your name"
          placeholderTextColor="#B0B0B0"
          value={userName}
          onChangeText={setUserName}
        />

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>WHAT YOU CAN DO HERE:</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              {/* <Text style={styles.featureIcon}>+</Text> */}
              <MaterialIcons name="add" size={14} color="#0066FF" style={{ fontWeight: '600' }} />
            </View>
            <Text style={styles.featureText}>Report lost or found items</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              {/* <Text style={styles.featureIcon}>📷</Text> */}
              <MaterialIcons name="camera-alt" size={14} color="#0066FF" style={{ fontWeight: '600' }} />
            </View>
            <Text style={styles.featureText}>
              Capture photos and locations
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              {/* <Text style={styles.featureIcon}>🔧</Text> */}
              <MaterialIcons name="build" size={14} color="#0066FF" style={{ fontWeight: '600' }} />
            </View>
            <Text style={styles.featureText}>Help and support together</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={[
            styles.getStartedButton,
            !userName.trim() && styles.getStartedButtonDisabled,
          ]}
          onPress={handleGetStarted}
          disabled={!userName.trim()}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" style={styles.getStartedArrow} />
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Your identity helps other users to identify{'\n'}you in the community.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  logo: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 24,
    backgroundColor: '#FAFAFA',
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 75,
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#E8F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  featureText: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },
  getStartedButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  getStartedButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  getStartedArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default WelcomeScreen;
