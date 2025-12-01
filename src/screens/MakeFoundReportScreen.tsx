import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

type MakeFoundReportScreenProps = NativeStackScreenProps<
  any,
  'MakeFoundReport'
>;

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

const MakeFoundReportScreen: React.FC<MakeFoundReportScreenProps> = ({
  navigation,
  route,
}) => {
  const relatedReport = route.params?.relatedReport;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const categories = [
    'Wallet',
    'Phone',
    'Laptop',
    'Bag/Backpack',
    'Watch',
    'Keys',
    'Glasses',
    'Documents',
    'Jewelry',
    'Other',
  ];

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'FindDesk needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    setShowPhotoOptions(false);
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        maxHeight: 1000,
        maxWidth: 1000,
        quality: 0.8,
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to capture photo',
          );
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          if (imageUri && selectedImages.length < 5) {
            setSelectedImages([...selectedImages, imageUri]);
          }
        }
      },
    );
  };

  const handleSelectFromGallery = () => {
    setShowPhotoOptions(false);

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5 - selectedImages.length,
        maxHeight: 1000,
        maxWidth: 1000,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const newImages = response.assets
            .map(asset => asset.uri)
            .filter(uri => uri !== undefined) as string[];
          setSelectedImages([...selectedImages, ...newImages].slice(0, 5));
        }
      },
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (description.trim().length < 10) {
      Alert.alert(
        'Error',
        'Please provide a detailed description (at least 10 characters)',
      );
      return;
    }
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please upload at least one photo');
      return;
    }

    // Get current location and submit report
    setIsLoadingLocation(true);
    getCurrentLocation()
      .then(location => {
        setIsLoadingLocation(false);

        // Prepare report data with current location
        const reportData = {
          id: Date.now().toString(),
          category: selectedCategory,
          description: description,
          images: selectedImages,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address || 'Current Location',
          },
          relatedToReport: relatedReport?.id || null,
          timestamp: new Date().toISOString(),
          foundBy: 'User',
        };

        // Log the report data
        console.log('📝 Found Report submitted:', reportData);

        Alert.alert(
          'Success',
          'Found item report submitted successfully!\n\n' +
            'Category: ' +
            selectedCategory +
            '\nPhotos: ' +
            selectedImages.length +
            '\nLocation: ' +
            (location.address || `${location.latitude}, ${location.longitude}`),
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setSelectedCategory(null);
                setDescription('');
                setSelectedImages([]);
                navigation.goBack();
              },
            },
          ],
        );
      })
      .catch(error => {
        setIsLoadingLocation(false);
        console.error('❌ Location Error:', error);
        Alert.alert(
          'Location Error',
          'Could not get current location. Please try again.',
        );
      });
  };

  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Current Location:', latitude, longitude);
          resolve({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        error => {
          console.error('Location error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make a found report</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Feather
            name="info"
            size={20}
            color="#0066FF"
            style={styles.infoIcon}
          />
          <Text style={styles.infoBannerText}>Reporting a found item</Text>
        </View>

        {/* Related Item Display */}
        {relatedReport && (
          <View style={styles.relatedReportCard}>
            <View style={styles.relatedReportHeader}>
              <Feather
                name="link"
                size={18}
                color={Colors.primary}
                style={styles.relatedIcon}
              />
              <Text style={styles.relatedLabel}>Related to report</Text>
            </View>
            <View style={styles.relatedReportContent}>
              {/* <View style={styles.relatedImageContainer}>
                <Feather
                  name="package"
                  size={40}
                  color={Colors.primary}
                />
              </View> */}
              <Image
                source={require('../../assets/images/logo/wallet.png')}
                style={[
                  styles.relatedImageContainer,
                  { width: 100, height: 100 },
                ]}
                resizeMode="contain"
              />
              <View style={styles.relatedTextContainer}>
                <Text style={styles.relatedTitle} numberOfLines={2}>
                  {relatedReport.title}
                </Text>
                <View style={styles.relatedInfoRow}>
                  <Feather
                    name="map-pin"
                    size={14}
                    color={Colors.textSecondary}
                    style={styles.relatedSmallIcon}
                  />
                  <Text style={styles.relatedInfo} numberOfLines={1}>
                    {relatedReport.location}
                  </Text>
                </View>
                <View style={styles.relatedInfoRow}>
                  <Feather
                    name="user"
                    size={14}
                    color={Colors.textSecondary}
                    style={styles.relatedSmallIcon}
                  />
                  <Text style={styles.relatedInfo}>
                    by {relatedReport.postedBy}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.relatedStatusBadge,
                  {
                    backgroundColor:
                      relatedReport.status === 'Lost' ? '#FFE8E8' : '#E8F5E9',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.relatedStatusText,
                    {
                      color:
                        relatedReport.status === 'Lost'
                          ? '#FF4444'
                          : relatedReport.status === 'Found'
                          ? '#44AA44'
                          : Colors.primary,
                    },
                  ]}
                >
                  {relatedReport.status}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category of the item</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                !selectedCategory && styles.placeholderText,
              ]}
            >
              {selectedCategory || 'Select a category'}
            </Text>
            <Feather
              name="chevron-down"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Category Picker Modal */}
        <Modal
          visible={showCategoryPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                  <Feather name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={categories}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      selectedCategory === item && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(item);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        selectedCategory === item &&
                          styles.categoryItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Describe the item</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Provide the details about the found item..."
            placeholderTextColor={Colors.placeholder}
            multiline
            numberOfLines={5}
            maxLength={500}
            value={description}
            onChangeText={setDescription}
          />
          <Text style={styles.characterCount}>
            {description.length}/500 characters
          </Text>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Photo of the item</Text>

          {/* Selected Photos */}
          {selectedImages.length > 0 && (
            <View style={styles.photosGrid}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image
                    source={{ uri: image }}
                    style={styles.photoThumbnail}
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x-circle" size={24} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Upload Area */}
          <View style={styles.uploadArea}>
            <Feather
              name="image"
              size={40}
              color={Colors.primary}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload photo</Text>
          </View>

          {/* Photo Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPhotoOptions(true)}
          >
            <Feather
              name="camera"
              size={18}
              color={Colors.background}
              style={styles.buttonIcon}
            />
            <Text style={styles.actionButtonText}>Upload a photo</Text>
          </TouchableOpacity>

          {/* Photo Options Modal */}
          <Modal
            visible={showPhotoOptions}
            transparent
            animationType="slide"
            onRequestClose={() => setShowPhotoOptions(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.photoOptionsModal}>
                <View style={styles.modalHandle} />
                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleTakePhoto}
                >
                  <Feather
                    name="camera"
                    size={24}
                    color={Colors.primary}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Take a Photo</Text>
                    <Text style={styles.optionSubtitle}>
                      Capture with your camera
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleSelectFromGallery}
                >
                  <Feather
                    name="image"
                    size={24}
                    color={Colors.primary}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Choose from Gallery</Text>
                    <Text style={styles.optionSubtitle}>
                      Select from your photos
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowPhotoOptions(false)}
                >
                  <Text style={styles.closeModalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoadingLocation && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoadingLocation}
          >
            <Text style={styles.submitButtonText}>
              {isLoadingLocation
                ? 'Getting location...'
                : 'Submit found report'}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: Spacing.xl,
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#E8F0FF',
    borderRadius: BorderRadius.large,
  },
  infoIcon: {
    marginRight: Spacing.md,
  },
  infoBannerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  dropdownText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    flex: 1,
  },
  placeholderText: {
    color: Colors.placeholder,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  categoryItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  categoryItemText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
  },
  categoryItemTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  photoWrapper: {
    position: 'relative',
    width: '30%',
  },
  photoThumbnail: {
    width: '100%',
    height: 100,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.lightGray,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primaryLight,
  },
  uploadIcon: {
    marginBottom: Spacing.md,
  },
  uploadText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  photoOptionsModal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionIcon: {
    marginRight: Spacing.lg,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  closeModalButton: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  closeModalButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textTertiary,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  relatedReportCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.primaryLight,
    overflow: 'hidden',
  },
  relatedReportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  relatedIcon: {
    marginRight: Spacing.sm,
  },
  relatedLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  relatedReportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  relatedImageContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  relatedTextContainer: {
    flex: 1,
  },
  relatedTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  relatedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  relatedSmallIcon: {
    marginRight: Spacing.xs,
  },
  relatedInfo: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  relatedStatusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.medium,
  },
  relatedStatusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
});

export default MakeFoundReportScreen;
