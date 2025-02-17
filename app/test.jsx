import React, { useState } from "react";
import { View, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Test = () => {
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Function to pick an image from the user's gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  // Function to upload the selected image
  const uploadImage = async () => {
    if (!image) {
      setUploadStatus("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("http://192.168.215.52:5000/api/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick an image" onPress={pickImage} />
      {image && (
        <View style={{ marginVertical: 20 }}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        </View>
      )}
      <Button title="Upload Image" onPress={uploadImage} />
      {uploadStatus && <Text style={{ marginTop: 20 }}>{uploadStatus}</Text>}
    </View>
  );
};

export default Test;
