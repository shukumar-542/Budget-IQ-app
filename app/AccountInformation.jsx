import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // ✅ correct
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
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
import {
  useUserGetMeQuery,
  useUserInfoUpdateMutation,
} from "../redux/services/api";
// import {route}
const AccountInformation = () => {
  const { data, refetch } = useUserGetMeQuery();
  const router = useRouter();
  const [image, setImage] = useState(null);
  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImage = data?.data?.profileImageUrl;
        const storedName = data?.data?.fullName;
        const storedEmail = data?.data?.email;
        if (storedImage) {
          setImage(storedImage); // use stored image
        }
        if (storedName) {
          setName(storedName);
        }
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) { }
    };

    loadImage();
  }, [data]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (text) => {
    setEmail(text);
    // Basic email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(text));
  };

  const user = useSelector((state) => state.user);
  const [userInfoUpdate, { isLoading }] = useUserInfoUpdateMutation();

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

  const handleSaveChanges = async () => {
    let contactNo = await SecureStore.getItemAsync("userContactNo");

    let storedName = await SecureStore.getItemAsync("userFullName");
    let storedEmail = await SecureStore.getItemAsync("userEmail");

    const finalName = name || storedName || "";
    const finalEmail = email || storedEmail || "";

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ fullName: finalName, email: finalEmail, contactNo })
    );
    if (image) {
      // Get the file extension
      const extensionMatch = /\.(\w+)$/.exec(image.split("/").pop());
      const extension = extensionMatch ? extensionMatch[1] : "jpg";

      // Get current date-time string
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

      // Use the user's name for the filename
      const sanitizedUserName = finalName.replace(/\s+/g, "_"); // replace spaces with underscores
      const filename = `${sanitizedUserName}_${timestamp}.${extension}`;

      // Determine MIME type
      const type = `image/${extension}`;

      // Append to FormData
      formData.append("file", {
        uri: image,
        name: filename,
        type,
      });
    }
    const response = await userInfoUpdate(formData).unwrap();
    refetch();
    await SecureStore.setItemAsync("userFullName", finalName);
    await SecureStore.setItemAsync("userEmail", finalEmail);
    router.replace("/SettingScreen");
  };

  return (
    <View style={styles.container}>
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
            style={[
              styles.in,
              {
                color: "#999",
              },
            ]}
            value={email} 
            onChangeText={validateEmail} // use validation function
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
  );
};

export default AccountInformation;

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#fff",
  alignItems: "center",
  justifyContent: "flex-start", // 👈 change from "space-between"
  paddingTop: 40,               // optional spacing from top
  paddingBottom: 80,            // 👈 gives room for the button
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
  position: "absolute",   // 👈 add this
  bottom: 40,             // 👈 controls lift height
  backgroundColor: Colors.primary,
  paddingVertical: 12,
  borderRadius: 100,
  alignItems: "center",
  width: "90%",
  alignSelf: "center",    // 👈 center horizontally
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
