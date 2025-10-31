import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as ImageManipulator from "expo-image-manipulator";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
} from "react-native";
import { Colors } from "../Constants/Colors";
import {
  useUserGetMeQuery,
  useUserInfoUpdateMutation,
} from "../redux/services/api";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// 🔧 Compress image before upload
const compressImage = async (uri) => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch {
    return uri; // fallback
  }
};

const AccountInformation = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, refetch } = useUserGetMeQuery();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [userInfoUpdate, { isLoading }] = useUserInfoUpdateMutation();

  // Load user data
  useEffect(() => {
    if (data?.data) {
      setImage(data.data.profileImageUrl || null);
      setName(data.data.fullName || "");
      setEmail(data.data.email || "");
    }
  }, [data]);

  const validateEmail = (text) => {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(text));
  };

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
      await SecureStore.setItemAsync("userImage", selectedUri);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const contactNo = await SecureStore.getItemAsync("userContactNo");
      const storedName = await SecureStore.getItemAsync("userFullName");
      const storedEmail = await SecureStore.getItemAsync("userEmail");

      const finalName = name || storedName || "";
      const finalEmail = email || storedEmail || "";

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({ fullName: finalName, email: finalEmail, contactNo })
      );

      if (image) {
        const compressedUri = await compressImage(image);
        const extensionMatch = /\.(\w+)$/.exec(compressedUri.split("/").pop());
        const extension = extensionMatch ? extensionMatch[1] : "jpg";

        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
          .getHours()
          .toString()
          .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;

        const sanitizedUserName = finalName.replace(/\s+/g, "_");
        const filename = `${sanitizedUserName}_${timestamp}.${extension}`;
        const type = `image/${extension}`;

        formData.append("file", {
          uri: compressedUri,
          name: filename,
          type,
        });
      }

      await userInfoUpdate(formData).unwrap();
      await SecureStore.setItemAsync("userFullName", finalName);
      await SecureStore.setItemAsync("userEmail", finalEmail);
      refetch();
      router.replace("/SettingScreen");
    } catch {
      Alert.alert("Upload Failed", "Please try again or use a smaller image.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Profile Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={
                image ? { uri: image } : require("../assets/images/avater.png")
              }
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.uploadIcon} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <AntDesign name="user" size={20} color="#555" />
              <TextInput
                style={styles.in}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <AntDesign name="mail" size={20} color="#555" />
              <TextInput
                style={[styles.in, { color: "#999" }]}
                value={email}
                onChangeText={validateEmail}
                placeholder="example@gmail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
            </View>
            {!isEmailValid && (
              <Text style={{ color: "red", marginTop: 5 }}>
                Please enter a valid email
              </Text>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !isEmailValid) && { opacity: 0.6 },
            ]}
            onPress={handleSaveChanges}
            disabled={isLoading || !isEmailValid}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountInformation;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 80,
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
  inputContainer: {
    width: "80%",
    marginTop: 15,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 50,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowRadius: 5,
  },
  in: {
    width: "100%",
  },
  button: {
    position: "absolute",
    bottom: 40,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
