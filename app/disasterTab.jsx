import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import BackButton from '../components/BackButton'
import { hp, wp } from '../helper/common'

const disasterTab = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
        <StatusBar style='dark'/>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton router={router}/>
            <Image resizeMode='contain' source={require('../assets/images/SafeNetText.png')} style={styles.logo}/>
          </View>
          <View style={styles.imageContainer}>
            <Image source={require('../assets/images/bloodDonation.jpg')} resizeMode='cover' style={styles.image}/>
            <View style={{marginTop:20,justifyContent:'center',alignItems:'center',paddingLeft:10,paddingRight:10}}>
            <Text style={styles.des}>Be the reason someone gets another chance at life.</Text>
            <Text style={styles.des}>Donate Blood</Text>
            </View>
          </View>
          <View style={styles.body}>
            <Pressable onPress={()=>router.push('disaster')} style={({ pressed }) => [
              styles.icon,
              pressed && { opacity: 0.5 },
            ]}>
            <View style={styles.box}>
              <Text style={styles.text}>Report Disaster</Text>
          </View>
          </Pressable>

          <Pressable onPress={()=>router.push('disasterList')} style={({ pressed }) => [
              styles.icon,
              pressed && { opacity: 0.5 },
            ]}>
            <View style={styles.box}>
              <Text style={styles.text}>Disaster List</Text>
            </View>
          </Pressable>  
          </View>
        </View>

    </ScreenWrapper>
  )
}

export default disasterTab

const styles = StyleSheet.create({
   header:{
      flexDirection: 'row',
      justifyContent:'space-between',
      width: wp(100),
      alignItems:'center',  
    },
    des:{
      fontWeight:'bold',
      fontSize:hp(1.8),
      textAlign:'center'
    },
    logo:{
      width: wp(25),
      height: hp(5),
    },
    container:{
        backgroundColor:'#D9F8DB',
        height:hp(100),
      },
      image:{
        width:wp(95),
        height:200,
        backgroundColor:'#D9F8DB',
        borderRadius:15,
      },
      imageContainer:{
        flex:1,
        alignItems:'center',
        marginTop:50,
      },
      body:{
        flex:1,
      },
      box:{
        backgroundColor:'#82c88e',
        height:hp(8),
        justifyContent:'center',
        alignItems:'center',
        borderCurve:'continuous',
        borderRadius:10,
        marginBottom:20,
        marginLeft:25,
        marginRight:25
      },
      text:{
        color:'white',
        fontWeight:'bold',
        fontSize:hp(1.8),
      }

})