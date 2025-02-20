import { StyleSheet, Text, View, Image, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helper/common';
import Input from '../components/Input';
import SignIn from '../components/SignIn';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Volunteer = () => {
  const router = useRouter();
  const [image, setImage] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User is not authenticated. Please log in.');
          router.push('/login');
          return;
        }

        const response = await axios.get('http://192.168.215.52:5000/api/home', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const { id } = response.data;
          setUserId(id);
        } else {
          throw new Error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        Alert.alert('Error', 'Failed to fetch user information.');
      }
    };

    fetchUserId();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Alert.alert('Success', 'Certificate image added successfully!');
    }
  };

  const handleVolunteer = async () => {
    if (!role || !image) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('created_by', userId);
      formData.append('certificate', {
        uri: image,
        name: 'certificate-image.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('http://192.168.215.52:5000/api/volunteer/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Volunteer registered!');
        setRole('');
        setImage('');
        router.push('/home');
      } else {
        Alert.alert('Error', response.data?.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Volunteer Registration Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton router={router} />
            <Image resizeMode="contain" source={require('../assets/images/SafeNetText.png')} style={styles.logo} />
          </View>
          <Text style={styles.Heading}>Register Volunteer</Text>
          <View style={styles.form}>
            <View style={styles.inp}>
              <Text style={styles.text}>Role</Text>
              <Input
                placeholder="Enter your role"
                value={role}
                onChangeText={setRole}
              />
            </View>
            <Pressable onPress={pickImage} style={styles.img}>
              <Text style={styles.buttonText}>Upload Certificate</Text>
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </Pressable>
            <View style={styles.btn}>
              <SignIn title="Submit" onPress={handleVolunteer} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Volunteer;

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
  form: {
    paddingTop: 20,
  },
  inp: {
    marginTop: 25,
  },
  text: {
    fontSize: 15,
    paddingLeft: 17,
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  img: {
    backgroundColor: '#37b33f',
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 35,
    marginLeft: 50,
    marginRight: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp(1.8),
  },
  btn: {
    paddingTop: 35,
    paddingBottom: 50,
  },
  container: {
    backgroundColor: '#D9F8DB',
    height: '100%',
  },
  image: {
    width: wp(80),
    height: hp(20),
    marginTop: 20,
    borderRadius: 10,
  },
});
