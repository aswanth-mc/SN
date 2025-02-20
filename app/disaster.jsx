import { StyleSheet, Text, View, Image, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helper/common';
import Input from '../components/Input';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import SignIn from '../components/SignIn';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Disaster = () => {
  const router = useRouter();
  const [image, setImage] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [affectedArea, setAffectedArea] = useState('');
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [district, setDistrict] = useState('');
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
      Alert.alert('Success', 'Image added successfully!');
    }
  };

  const toggleDatePicker = () => setShowPicker(!showPicker);

  const onChange = ({ type }, selectedDate) => {
    if (type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setFormattedDate(currentDate.toLocaleDateString('en-GB'));
    }
    toggleDatePicker();
  };

  const handleDisaster = async () => {
    if (!disasterType || !affectedArea || !formattedDate || !district || !image) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('disaster_type', disasterType);
      formData.append('affected_area', affectedArea);
      formData.append('dob', formattedDate);
      formData.append('district', district);
      formData.append('image', {
        uri: image,
        name: 'disaster-image.jpg',
        type: 'image/jpeg',
      });
      formData.append('created_by', userId);

      const response = await axios.post('http://192.168.215.52:5000/api/disaster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Disaster reported!');
        setDisasterType('');
        setAffectedArea('');
        setFormattedDate('');
        setDistrict('');
        setImage('');
        router.push('/disasterList');
      } else {
        Alert.alert('Error', response.data?.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Disaster Reporting Error:', error.response?.data || error.message);
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
          <Text style={styles.Heading}>Report Disaster</Text>
          <View style={styles.form}>
            <View style={styles.inp}>
              <Text style={styles.text}>Disaster Type</Text>
              <Input placeholder="Disaster Type" value={disasterType} onChangeText={setDisasterType} />
            </View>
            <View style={styles.inp}>
              <Text style={styles.text}>Affected Area</Text>
              <Input placeholder="Affected Area" value={affectedArea} onChangeText={setAffectedArea} />
            </View>
            <View style={styles.inp}>
              <Text style={styles.text}>Date</Text>
              {showPicker && <RNDateTimePicker mode="date" display="spinner" value={date} onChange={onChange} />}
              {!showPicker && (
                <Pressable onPress={toggleDatePicker}>
                  <Input placeholder="Date" value={formattedDate} editable={false} />
                </Pressable>
              )}
            </View>
            <View style={styles.inp}>
              <Text style={styles.text}>District</Text>
              <View style={styles.pic}>
                <Picker selectedValue={district} onValueChange={setDistrict}>
                  <Picker.Item label="Select District" value="" />
                  <Picker.Item label="Thiruvananthapuram" value="Thiruvananthapuram" />
                  <Picker.Item label="Kollam" value="Kollam" />
                  <Picker.Item label="Pathanamthitta" value="Pathanamthitta" />
                  <Picker.Item label="Alappuzha" value="Alappuzha" />
                  <Picker.Item label="Kottayam" value="Kottayam" />
                  <Picker.Item label="Idukki" value="Idukki" />
                  <Picker.Item label="Ernakulam" value="Ernakulam" />
                  <Picker.Item label="Thrissur" value="Thrissur" />
                  <Picker.Item label="Palakkad" value="Palakkad" />
                  <Picker.Item label="Malappuram" value="Malappuram" />
                  <Picker.Item label="Kozhikode" value="Kozhikode" />
                  <Picker.Item label="Wayanad" value="Wayanad" />
                  <Picker.Item label="Kannur" value="Kannur" />
                  <Picker.Item label="Kasaragod" value="Kasaragod" />
                </Picker>
              </View>
            </View>
            <Pressable onPress={pickImage} style={styles.img}>
              <Text style={styles.buttonText}>Upload Image</Text>
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </Pressable>
            <View style={styles.btn}>
              <SignIn title="Submit" onPress={handleDisaster} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Disaster;

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
});
