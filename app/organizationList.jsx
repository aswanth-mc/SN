import { Alert, Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Linking, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import axios from '../config/axiosConfig';

const OrganizationList = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://192.168.215.52:5000/api/organization?verified=true');
        setOrganizations(response.data.reverse());  // Reverse the array to show the last entered first
        setError(null);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('Failed to fetch organization data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filterOrganizations = () => {
    const filtered = organizations.filter((org) =>
      org.district.toLowerCase().includes(searchText.toLowerCase()) ||
      searchText === ''
    );
    return filtered;
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleLinkPress = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton router={router} />
            <Image source={require('../assets/images/SafeNetText.png')} style={styles.safeNetTextImage} />
          </View>
          <View style={styles.body}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by District"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}  // Update search text
            />

            <ScrollView style={styles.listContainer}>
              {filterOrganizations().map((org, index) => (
                <View key={index} style={styles.orgCard}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEmail(org.email)}>
                      <Image source={require('../assets/images/email.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCall(org.phone)}>
                      <Image source={require('../assets/images/phone.png')} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.orgInfo}>
                    <Text style={styles.orgName}>{org.org_name}</Text>
                    <Text style={styles.orgDetails}>District: {org.district}</Text>
                    <Text style={styles.orgDetails}>{org.phone_number}</Text>
                    <Text style={styles.orgDetails}>{org.email}</Text>
                    {org.social_media_link && (
                      <Pressable onPress={() => handleLinkPress(org.social_media_link)}>
                        <Text style={styles.linkText}>{org.social_media_link}</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default OrganizationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 5,
  },
  body: {
    padding: 20,
  },
  safeNetTextImage: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  searchBar: {
    backgroundColor: '#eaeaea',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  listContainer: {
    marginTop: 10,
  },
  orgCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orgInfo: {
    marginLeft: 15,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orgDetails: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
