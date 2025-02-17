import { Alert, Image, Pressable, StyleSheet, Text, View, Linking, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { hp, wp } from '../helper/common';
import axios from 'axios'; // Import Axios for API calls

const requirements = () => {
  const router = useRouter();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await axios.get('http://192.168.215.52:5000/api/requirements'); // Replace with your backend URL
      setRequirements(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch requirements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (mapLink) => {
    Linking.openURL(mapLink).catch(err => Alert.alert("Couldn't load page", err));
  };

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err => Alert.alert("Couldn't make a call", err));
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} />
          <Image resizeMode="contain" source={require('../assets/images/SafeNetText.png')} style={styles.logo} />
        </View>
        <Text style={styles.Heading}>Requirement List</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView style={styles.listContainer}>
            {requirements.length > 0 ? (
              requirements.map((item) => (
                <View key={item.id} style={styles.itemContainer}>
                  <Text style={styles.itemText}><Text style={styles.boldText}>Item:</Text> {item.item_name}</Text>
                  <Text style={styles.itemText}><Text style={styles.boldText}>Quantity:</Text> {item.quantity}</Text>
                  <Text style={styles.itemText}><Text style={styles.boldText}>Category:</Text> {item.category}</Text>
                  <Text style={styles.itemText}><Text style={styles.boldText}>Camp:</Text> {item.camp_name}</Text>
                  <Text style={styles.itemText}><Text style={styles.boldText}>City:</Text> {item.city}</Text>
                  <Text style={styles.itemText}><Text style={styles.boldText}>District:</Text> {item.district}</Text>

                  <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={() => handleMapPress(item.map_link)}>
                      <Text style={styles.buttonText}>View on Map</Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={() => handleCallPress(item.phone_number)}>
                      <Text style={styles.buttonText}>Call Camp</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No requirements found.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default requirements;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(100),
    alignItems: 'center',
  },
  logo: {
    width: wp(25),
    height: hp(5),
  },
  Heading: {
    fontSize: hp(3),
    fontWeight: 'bold',
    paddingTop: 50,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  container: {
    backgroundColor: '#D9F8DB',
    height: hp(100),
  },
  listContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});
