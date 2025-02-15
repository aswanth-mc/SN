import { Alert, Image, Pressable, StyleSheet, Text, View, } from 'react-native'
import React, { useRef,useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { hp, wp } from '../helper/common'
import Input from '../components/Input'
import SignIn from '../components/SignIn'
import { Picker } from '@react-native-picker/picker'
import axios from '../config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';



const organization = () => {
  const router = useRouter();
  const [orgName, setOrgName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://192.168.215.52:5000/api/home', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { id } = response.data;
        setUserId(id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);
  

  const handleOrg = async () => {
    // Validate required fields
    if (!orgName || !phoneNumber || !email || !district) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (!/^\d{10}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits');
      return;
    }
  
    try {
      // Retrieve the token before making the request
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
  
      // Send registration request
      const response = await axios.post(
        'http://192.168.215.52:5000/api/organization',
        {
          org_name: orgName,
          phone_number: phoneNumber,
          email: email,
          district: district,
          created_by: userId, // Make sure you're using userId here
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include Authorization header
        }
      );
  
      if (response.status === 201) {
        Alert.alert('Success', 'Organization registered!');
        setOrgName('');
        setPhoneNumber('');
        setEmail('');
        setDistrict('');
        router.push('/organizationList'); // Navigate to the organization list page
      } else {
        Alert.alert('Registration Failed', response.data?.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Organization Registration Error:', error.response?.data || error.message);
      Alert.alert('Registration Failed', error.response?.data?.error || 'Something went wrong.');
    }
  };
  

  return (
    <ScreenWrapper>
      <StatusBar style='dark'/>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} />
          <Image resizeMode='contain' source={require('../assets/images/SafeNetText.png')} style={styles.logo}/>
        </View>

        <View>
            <Text style={styles.Heading}>Organization Registration</Text>
          </View>
        <View style={styles.form}>

          <View style={styles.inp}>
            <Text style={styles.text}>Organization Name</Text>
          <Input placeholder='Organization Name'value={orgName} onChangeText={setOrgName}
          />
          </View>
          <View style={styles.inp}>
            <Text style={styles.text}>Phone Number</Text>
          <Input placeholder='Phone Number' keyboardType="numeric"
          value={phoneNumber} onChangeText={setPhoneNumber}
          />
          </View>

          <View style={styles.inp}>
            <Text style={styles.text}>Email</Text>
          <Input placeholder='Email' keyboardType="email-address"  
          value={email}
          onChangeText={setEmail}
          />
          </View>

          <View style={styles.inp}>
          <Text style={styles.text}>District</Text>
          <View style={styles.pic}>
          <Picker
            selectedValue={district}
             onValueChange={setDistrict}>
              <Picker.Item label="District" value="null" style={{color:'rgba(0, 0, 0, 0.5)'}} />
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
          <View style={styles.button}>
          <SignIn title='Submit' onPress={handleOrg}/>
          </View>
        </View>

        
      </View> 
    </ScreenWrapper>
  )
}

export default organization

const styles = StyleSheet.create({
  header:{
    flexDirection: 'row',
    justifyContent:'space-between',
    width: wp(100),
    alignItems:'center',  
  },
  logo:{
    width: wp(25), // Adjust width of the logo
    height: hp(5),
  },
  Heading:{
    fontSize:hp(3),
    fontWeight:'bold',
    paddingTop:50,
    textAlign:'center',
    textDecorationLine:'underline'
    
  },
  welcomeText:{
    fontSize:hp(3.5),
    fontWeight:'bold',
    paddingTop:50,
    paddingLeft:10,
    
  },
  form:{
    color:'red',
    paddingTop:20,
  },
  inp:{
    marginTop:25,
  },
  button:{
    paddingTop:35,
    paddingLeft:10,
    paddingRight:10,
  },
  container:{
    backgroundColor:'#D9F8DB',
    height:hp(100),
  },
  text:{
    fontSize:15,
    paddingLeft:17,
    paddingBottom:5,
    fontWeight:'bold'
  },
  footer:{ 
    flex:1,
    flexDirection:'row',
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
    
   

  },
  signupText:{
   fontSize:wp(3.5),
   paddingTop:200,
   

  },
  pic:{
    height:hp(7),
    borderWidth:0.4,
    borderColor:'black',
    borderRadius:10,
    borderCurve:'continuous',
    marginHorizontal:15,
    marginTop:0,
  }

})