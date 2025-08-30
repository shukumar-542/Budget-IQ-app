import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../Constants/Colors";

import { useDispatch } from "react-redux";
import { useUserInfoUpdateMutation } from "../redux/services/api";
import { updateUserInfo } from "../redux/slices/userSlice";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
// import {route}
const AccountInformation = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImage = await SecureStore.getItemAsync("userImage");
        if (storedImage) {
          setImage(storedImage); // use stored image
        }
      } catch (error) {
        console.error("Failed to load image from SecureStore", error);
      }
    };

    loadImage();
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [triggerUpdateUserApi] = useUserInfoUpdateMutation();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      await SecureStore.setItemAsync("userImage", selectedUri); // save it
    }
  };

  const handleSaveChanges = () => {
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("email", email);
    formData.append("contactNo", "");

    if (image) {
      formData.append("file", {
        uri: image,
        type: "image/jpeg", // adjust if needed
        name: "profile.jpg",
      });
    }

    // Dispatch the thunk to update Redux + SecureStore + API
    dispatch(updateUserInfo({ formData, triggerUpdateUserApi }));
    router.replace("/SettingScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            image ? { uri: image } : require("@/assets/images/avater.png")
          }
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.uploadIcon} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <AntDesign name="user" size={20} color="#555" />
          <TextInput
            style={styles.in}
            value={name} // connects to state
            onChangeText={setName} // updates state when typing
            placeholder="Name"
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <AntDesign name="mail" size={20} color="#555" />
          <TextInput
            style={styles.in}
            value={email} // connects to state
            onChangeText={setEmail} // updates state when typing
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>
          {user.status === "loading" ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  uploadIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 4,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 50,
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowRadius: 5,
  },
  inputContainer: {
    width: "80%",
    marginTop: 10,
  },
  in: {
    width: "100%",
  },
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: Colors.primary,
    width: "100%",
  },

  pressed: {
    opacity: 0.75,
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  button: {
    marginTop: "auto",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
    width: "90%",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
