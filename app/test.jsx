import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const Test = () => {
  // Function to send disaster emails
  const sendEmails = async () => {
    try {
      const response = await axios.post('http://192.168.215.52:5000/api/test/send-disaster-emails'); // Replace with your backend URL

      if (response.status === 200) {
        Alert.alert('Success', 'Emails sent successfully!');
      } else {
        Alert.alert('Error', response.data?.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      Alert.alert('Error', 'Failed to send emails.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Send Disaster Emails" onPress={sendEmails} color="#37b33f" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9F8DB',
  },
});

export default Test;