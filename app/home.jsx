import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helper/common';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Home = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({ full_name: '', id: '', email: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://192.168.215.52:5000/api/home', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Response from server:', response.data); // Log the response for debugging
        setUserData({
          full_name: response.data.full_name,
          id: response.data.id,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image source={require('../assets/images/SafeNetText.png')} resizeMode="contain" style={styles.logo} />
        <View style={styles.header}>
          <Image source={require('../assets/images/SafeNet.png')} resizeMode="contain" style={styles.image} />
        </View>
        <Text style={styles.userInfo}>
          Welcome, {userData.full_name || 'Unknown'}{'\n'}
          Email: {userData.email || 'Unknown'}{'\n'}
          ID: {userData.id || 'Unknown'}
        </Text>
        <View style={styles.home}>
          {menuItems.map(({ label, route }) => (
            <Pressable
              key={route}
              onPress={() => router.push(route)}
              style={({ pressed }) => [styles.icon, pressed && { opacity: 0.5 }]}
            >
              <Text style={styles.iconText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const menuItems = [
  { label: 'Emergency Contacts', route: 'contacts' },
  { label: 'Disaster', route: 'disasterTab' },
  { label: 'Essential Supplies', route: 'requirements' },
  { label: 'Blood Bank', route: 'bloodTab' },
  { label: 'Volunteer', route: 'volunteerTab' },
  { label: 'Vehicle', route: 'vehicleTab' },
  { label: 'Shelter', route: 'shelter' },
  { label: 'SafeGuide', route: 'safeguide' },
  { label: 'Do, Don’t', route: 'doDont' },
];

export default Home;

const styles = StyleSheet.create({
  logo: {
    width: wp(25),
    height: hp(5),
    marginBottom: 20,
    marginLeft: 5,
  },
  image: {
    width: wp(95),
    height: 200,
    backgroundColor: '#D9F8DB',
    marginLeft: wp(2.5),
  },
  userInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  home: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'center',
    marginTop: 230,
  },
  icon: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  iconText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
