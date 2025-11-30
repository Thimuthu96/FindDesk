import React, { useState, useRef, useEffect } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Spacing, Typography, BorderRadius } from '../styles/constants';

type MakeLostReportScreenProps = NativeStackScreenProps<any, 'MakeLostReport'>;

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

const MakeLostReportScreen: React.FC<MakeLostReportScreenProps> = ({
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Initialize map location when modal is opened
  useEffect(() => {
    if (showMapModal && !mapLocation) {
      console.log('Map modal opened, initializing map location');
      setMapLocation({
        latitude: 6.9271,
        longitude: 79.8612,
        address: 'Select location on map',
      });
    }
  }, [showMapModal]);

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

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fine =
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
        const coarse =
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];

        return (
          fine === PermissionsAndroid.RESULTS.GRANTED ||
          coarse === PermissionsAndroid.RESULTS.GRANTED
        );
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

  const handleAttachLocation = async () => {
    setShowLocationOptions(false);
    setIsLoadingLocation(true);

    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to attach your current location',
        );
        setIsLoadingLocation(false);
        return;
      }

      console.log('Requesting current location...');

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          setSelectedLocation({
            latitude,
            longitude,
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(
              4,
            )}`,
          });

          setMapLocation({
            latitude,
            longitude,
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(
              4,
            )}`,
          });

          setIsLoadingLocation(false);
          Alert.alert('Success', 'Location attached successfully');
        },
        error => {
          setIsLoadingLocation(false);
          console.log('Error =>', error);

          Alert.alert(
            'Location Error',
            error.message || 'Failed to get current location',
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );

      // Geolocation.getCurrentPosition(
      //   position => {
      //     try {
      //       console.log('Position received:', position);
      //       const { latitude, longitude } = position.coords;
      //       const address = `Location: ${latitude.toFixed(
      //         4,
      //       )}, ${longitude.toFixed(4)}`;

      //       const locationData: LocationData = {
      //         latitude,
      //         longitude,
      //         address,
      //       };

      //       setSelectedLocation(locationData);
      //       setMapLocation(locationData);
      //       setIsLoadingLocation(false);

      //       Alert.alert('Success', 'Location attached successfully');
      //     } catch (err) {
      //       console.error('Error processing location:', err);
      //       setIsLoadingLocation(false);
      //       Alert.alert('Error', 'Failed to process location data');
      //     }
      //   },
      //   (error: any) => {
      //     setIsLoadingLocation(false);
      //     console.error('Geolocation error:', error);

      //     let errorMessage = 'Failed to get current location';
      //     if (error.code === 'PERMISSION_DENIED' || error.code === 1) {
      //       errorMessage =
      //         'Location permission denied. Please enable it in settings.';
      //     } else if (
      //       error.code === 'POSITION_UNAVAILABLE' ||
      //       error.code === 2
      //     ) {
      //       errorMessage =
      //         'Location unavailable. Please try enabling GPS or try later.';
      //     } else if (error.code === 'TIMEOUT' || error.code === 3) {
      //       errorMessage = 'Location request timed out. Please try again.';
      //     }

      //     console.log('Showing alert with message:', errorMessage);
      //     Alert.alert('Location Error', errorMessage);
      //   },
      //   {
      //     enableHighAccuracy: true,
      //     timeout: 15000,
      //     maximumAge: 0,
      //   },
      // );
    } catch (err) {
      console.error('Unexpected error in handleAttachLocation:', err);
      setIsLoadingLocation(false);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleOpenMap = async () => {
    try {
      console.log('Opening map modal...');
      setShowLocationOptions(false);

      // Initialize map with current location or default
      if (!mapLocation) {
        console.log('Map location not set, using default...');
        setMapLocation({
          latitude: 6.9271,
          longitude: 80.7789,
          address: 'Select location on map',
        });
      } else {
        console.log('Using existing map location:', mapLocation);
      }

      // Show modal
      setShowMapModal(true);
      console.log('Map modal opened');
    } catch (err) {
      console.error('Error opening map:', err);
      Alert.alert('Error', 'Failed to open map. Please try again.');
    }
  };

  const handleMapPress = (e: any) => {
    try {
      if (!e || !e.nativeEvent || !e.nativeEvent.coordinate) {
        console.error('Invalid map press event:', e);
        return;
      }

      const { latitude, longitude } = e.nativeEvent.coordinate;
      console.log('Map pressed at:', latitude, longitude);
      setMapLocation({
        latitude,
        longitude,
        address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      });

      // const address = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(
      //   4,
      // )}`;

      // setMapLocation({
      //   latitude,
      //   longitude,
      //   address,
      // });
    } catch (err) {
      console.error('Error handling map press:', err);
    }
  };

  const handleConfirmLocation = () => {
    if (mapLocation) {
      setSelectedLocation(mapLocation);
      setShowMapModal(false);
    }
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
    // if (!selectedLocation) {
    //   Alert.alert('Error', 'Please attach a location');
    //   return;
    // }

    Alert.alert(
      'Success',
      'Report submitted successfully!\n\nCategory: ' +
        selectedCategory +
        '\nDescription: ' +
        description +
        '\nPhotos: ' +
        selectedImages.length +
        '\nLocation: ' +
        // selectedLocation.address,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
    );
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
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={Colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make a lost report</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color="#0066FF"
            style={styles.infoIcon}
          />
          <Text style={styles.infoBannerText}>Reporting a lost item</Text>
        </View>

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
            <MaterialCommunityIcons
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
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={Colors.text}
                  />
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
            placeholder="Provide the details about the lost item..."
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
          <Text style={styles.sectionLabel}>
            Photo of the item (if available)
          </Text>

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
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color="#FF4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Upload Area */}
          <View style={styles.uploadArea}>
            <MaterialCommunityIcons
              name="image-plus"
              size={40}
              color={Colors.primary}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload photo</Text>
          </View>

          {/* Photo Action Buttons */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPhotoOptions(true)}
          >
            <MaterialCommunityIcons
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
                  <MaterialCommunityIcons
                    name="camera"
                    size={24}
                    color={Colors.primary}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Take a Photo</Text>
                    <Text style={styles.optionSubtitle}>
                      Use your device camera
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleSelectFromGallery}
                >
                  <MaterialCommunityIcons
                    name="image"
                    size={24}
                    color={Colors.primary}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Select from Gallery</Text>
                    <Text style={styles.optionSubtitle}>
                      Choose from your device
                    </Text>
                  </View>
                  <MaterialCommunityIcons
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

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Attached last location when item lost
          </Text>

          {/* Location Display */}
          {selectedLocation && (
            <View style={styles.locationCard}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={Colors.primary}
                style={styles.locationIcon}
              />
              <View style={styles.locationContent}>
                <Text style={styles.locationAddress}>
                  {selectedLocation.address}
                </Text>
                <Text style={styles.locationCoords}>
                  {selectedLocation.latitude.toFixed(4)},{' '}
                  {selectedLocation.longitude.toFixed(4)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Location Action Buttons */}
          {/* <View style={styles.locationButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { flex: 1, marginRight: Spacing.md },
              ]}
              onPress={handleAttachLocation}
              disabled={isLoadingLocation}
            >
              <MaterialCommunityIcons
                name={isLoadingLocation ? 'loading' : 'map-marker'}
                size={18}
                color={Colors.background}
                style={styles.buttonIcon}
              />
              <Text style={styles.actionButtonText}>
                {isLoadingLocation ? 'Getting location...' : 'Attach location'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { flex: 1 }]}
              onPress={handleOpenMap}
            >
              <MaterialCommunityIcons
                name="map-search"
                size={18}
                color={Colors.background}
                style={styles.buttonIcon}
              />
              <Text style={styles.actionButtonText}>Search on Map</Text>
            </TouchableOpacity>
          </View> */}

          {/* Map Modal */}
          <Modal
            visible={showMapModal}
            transparent={false}
            animationType="slide"
            onRequestClose={() => {
              console.log('Modal close requested');
              setShowMapModal(false);
            }}
          >
            <SafeAreaView style={styles.mapModalContainer}>
              <View style={styles.mapHeader}>
                <Text style={styles.mapTitle}>Select Location</Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Close button pressed');
                    setShowMapModal(false);
                  }}
                  style={styles.mapCloseButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={Colors.text}
                  />
                </TouchableOpacity>
              </View>

              {mapLocation ? (
                <>
                  <View style={{ flex: 1 }}>
                    <MapView
                      ref={mapRef}
                      style={styles.map}
                      initialRegion={{
                        latitude: mapLocation.latitude,
                        longitude: mapLocation.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                      onPress={handleMapPress}
                      scrollEnabled={true}
                      zoomEnabled={true}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      loadingEnabled={true}
                      loadingIndicatorColor={Colors.primary}
                    >
                      <Marker
                        coordinate={{
                          latitude: mapLocation.latitude,
                          longitude: mapLocation.longitude,
                        }}
                        title="Lost item location"
                        description={mapLocation.address}
                      />
                    </MapView>
                  </View>
                  <View style={styles.mapFooter}>
                    <TouchableOpacity
                      style={styles.mapConfirmButton}
                      onPress={handleConfirmLocation}
                    >
                      <Text style={styles.mapConfirmButtonText}>
                        Confirm Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.mapLoadingContainer}>
                  <Text style={styles.mapLoadingText}>Loading map...</Text>
                </View>
              )}
            </SafeAreaView>
          </Modal>

          {/* Location Options Modal */}
          <Modal
            visible={showLocationOptions}
            transparent
            animationType="slide"
            onRequestClose={() => setShowLocationOptions(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.photoOptionsModal}>
                <View style={styles.modalHandle} />
                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleAttachLocation}
                  disabled={isLoadingLocation}
                >
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={24}
                    color={Colors.primary}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Current Location</Text>
                    <Text style={styles.optionSubtitle}>
                      Use your device GPS
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleOpenMap}
                >
                  <MaterialCommunityIcons
                    name="map-search"
                    size={24}
                    color={Colors.primary}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Search on Map</Text>
                    <Text style={styles.optionSubtitle}>
                      Pick location from map
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowLocationOptions(false)}
                >
                  <Text style={styles.closeModalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit report</Text>
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primaryLight,
  },
  locationIcon: {
    marginRight: Spacing.md,
  },
  locationContent: {
    flex: 1,
  },
  locationAddress: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  locationCoords: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  locationButtonsContainer: {
    flexDirection: 'row',
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mapTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  mapCloseButton: {
    padding: Spacing.md,
  },
  map: {
    flex: 1,
  },
  mapFooter: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mapConfirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapConfirmButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  mapLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  mapLoadingText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default MakeLostReportScreen;
