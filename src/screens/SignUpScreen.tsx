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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { width } = useWindowDimensions();

  const handleSignUp = () => {
    if (email.trim() && password.trim() && confirmPassword.trim() && password === confirmPassword) {
      // Navigate to Home without authentication
      navigation.replace('Home', { userName: 'User' });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const isFormValid =
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Image
            source={require('../../assets/images/logo/login_logo.png')}
            style={[
              styles.logo,
              {
                width: width * 0.35,
                height: (width * 0.35 * 256) / 256,
              },
            ]}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>FindDesk</Text>

          {/* Email Input Section */}
          <Text style={styles.label}>Enter your email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="test@gmail.com"
            placeholderTextColor={Colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={true}
          />

          {/* Password Input Section */}
          <Text style={styles.label}>Enter your password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={Colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={true}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input Section */}
          <Text style={styles.label}>Re-enter your password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={Colors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={true}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Text style={styles.eyeText}>{showConfirmPassword ? '👁️' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              !isFormValid && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={!isFormValid}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  logo: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xxl,
    letterSpacing: 2,
    textAlign: 'center',
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.lightGrayBg,
  },
  passwordContainer: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrayBg,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  passwordInput: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  eyeIcon: {
    padding: Spacing.md,
    marginRight: -Spacing.md,
  },
  eyeText: {
    fontSize: 18,
  },
  signUpButton: {
    width: '100%',
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  signUpButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  signUpButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  loginButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#E8F0FF',
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
});

export default SignUpScreen;
