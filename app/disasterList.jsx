import { Alert, Image, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import axios from '../config/axiosConfig'; // Ensure axios is properly imported and configured

const DisasterList = () => {
  const router = useRouter();
  const [disasters, setDisasters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://192.168.215.52:5000/api/disaster');
        const sortedDisasters = response.data.sort((a, b) => b.id - a.id);
        setDisasters(sortedDisasters);
        setError(null);
      } catch (error) {
        console.error('Error fetching disasters:', error);
        setError('Failed to fetch disaster data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  const filterDisasters = () => {
    return disasters.filter((disaster) =>
      disaster.district.toLowerCase().includes(searchText.toLowerCase())
    );
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
              onChangeText={setSearchText}
            />
            <ScrollView style={styles.listContainer}>
              {filterDisasters().map((disaster, index) => (
                <View key={index} style={styles.disasterCard}>
                  <View style={styles.disasterInfo}>
                    <Text style={styles.disasterName}>{disaster.disaster_type} ({disaster.affected_area})</Text>
                    <Text style={styles.disasterDetails}>District: {disaster.district}</Text>
                    <Text style={styles.disasterDetails}>Date: {disaster.dob}</Text>
                    {disaster.image && (
                      <Image source={{ uri: disaster.image }} style={styles.disasterImage} />
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

export default DisasterList;

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
    padding: 12,
    fontSize: 16,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
  },
  listContainer: {
    marginTop: 10,
  },
  disasterCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 8,
  },
  disasterInfo: {
    flex: 1,
  },
  disasterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  disasterDetails: {
    fontSize: 16,
    color: '#555',
  },
  disasterImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 10,
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