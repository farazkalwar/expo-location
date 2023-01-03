import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Linking,
} from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState();
  const [locationPermissionButton, setLocationPermissionButton] =
    useState(false);
  const [address, setAddress] = useState();

  const getPermissions = async () => {
    let permission = {};
    while (permission.status !== "granted") {
      console.log("getpermwhile");
      try {
        permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === "granted") {
          setLocationPermissionButton(false);
          return permission.status;
        }

        if (!permission.canAskAgain) {
          setLocationPermissionButton(true);
          return permission.status;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function getCurrentLocation() {
    let currentLocation = null;
    while (currentLocation == null || currentLocation == undefined) {
      try {
        currentLocation = await Location.getCurrentPositionAsync({});
        console.log(currentLocation.coords);
        setLocation(currentLocation);
        return;
      } catch (error) {
        console.log("crloc", error);
      }
    }
  }

  async function getPermissionAndCurrentLocation() {
    let locationPermission = await getPermissions();
    if (locationPermission !== "granted") return;
    getCurrentLocation();
  }

  async function allowLocationPermission() {
    let permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      setLocationPermissionButton(true);
      Linking.openSettings();
      return;
    }
    setLocationPermissionButton(false);
    return;
  }

  useEffect(() => {
    getPermissionAndCurrentLocation();
    // getPermissions();
    // getCurrentLocation();
    // console.log('effect loc',location)
  }, [locationPermissionButton]);

  const geocode = async () => {
    const geocodedLocation = await Location.geocodeAsync(address);
    console.log("Geocoded Address:");
    console.log(geocodedLocation);
  };

  const reverseGeocode = async () => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    console.log("Address:");
    console.log(reverseGeocodedAddress);
  };

  return locationPermissionButton ? (
    <View style={{ margin: 50 }}>
      <Button
        title="Allow Location Permission"
        onPress={() => allowLocationPermission()}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Geocode Address" onPress={geocode} />
      <Button
        title="Reverse Geocode Current Location"
        onPress={reverseGeocode}
      />
      <View>
        <Button title="getlocation" onPress={getCurrentLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 50,
  },
});
