import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Colors } from "../../Constants/Colors";
import {
  useDeleteUserMutation,
  useUserGetMeQuery,
  useGetReviewTheAppMutation,
} from "../../redux/services/api";
import { clearToken } from "../../redux/slices/authSlice";
import { deleteAuthData } from "../../utils/secureStore";
import { removeApiSuccess } from "../../redux/slices/messageSlice";
import { getReviewInfo, setReviewInfo } from "../../utils/secureStore";

const SettingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [deleteUser] = useDeleteUserMutation();
  const [doReview] = useGetReviewTheAppMutation();

  const [userImage, setUserImage] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const { data } = useUserGetMeQuery();

  const [activeItem, setActiveItem] = useState(null);

  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (data?.data) {
      setUserImage(data?.data?.profileImageUrl);
      setUserFullName(data?.data?.fullName);
      setUserEmail(data?.data?.email);
    }
  }, [data]);

  const handleLogOut = async () => {
    try {
      await deleteAuthData();
      dispatch(clearToken());
      dispatch(removeApiSuccess());
      router.replace("/LoginScreen");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const menuItems = [
    {
      name: "ExpenseCategories",
      icon: <Ionicons name="git-branch-outline" size={20} color="black" />,
      label: "Expenses Categories",
    },
    {
      name: "IncomeCategories",
      icon: <FontAwesome name="money" size={20} color="black" />,
      label: "Income Categories",
    },
    {
      name: "TermsAndPolicies",
      icon: <Ionicons name="shield-checkmark-outline" size={20} color="black" />,
      label: "Terms & Policies",
    },
    {
      name: "PrivacyPolicy",
      icon: <Ionicons name="shield-checkmark-outline" size={20} color="black" />,
      label: "Privacy Policy",
    },
    {
      name: "ReviewTheApp",
      icon: <AntDesign name="like1" size={20} color="black" />,
      label: "Review The App",
    },
    {
      name: "DeleteAccount",
      icon: <Ionicons name="trash-bin-outline" size={20} color="black" />,
      label: "Delete Account",
    },
  ];

  const handleItemPress = async (item, index) => {
    if (item.name === "DeleteAccount") {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this account?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteUser({}).unwrap();
                dispatch(clearToken());
                dispatch(removeApiSuccess());
                router.push("/SignUpScreen");
              } catch (e) {
                console.error("Delete error:", e);
              }
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }

    if (item.name === "ReviewTheApp") {
      const storedReview = await getReviewInfo();
      if (!storedReview) {
        setIsReviewModalVisible(true);
      } else {
        Alert.alert("You’ve already reviewed the app. Thank you!");
      }
      return;
    }

    setActiveItem(index);
    navigation.navigate(item.name);
  };

  const handleStarPress = async (rating) => {
    setSelectedRating(rating);
    try {
      await doReview({ star: rating }).unwrap();
      await setReviewInfo({ hasReviewed: true });
      Alert.alert("Thank you!", `You rated us ${rating} star${rating > 1 ? "s" : ""}.`);
      setIsReviewModalVisible(false);
    } catch (error) {
      console.error("Review error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Account</Text>

      {/* User Info */}
      <TouchableOpacity
        onPress={() => navigation.navigate("AccountInformation")}
        style={styles.profileSection}
      >
        {userImage ? (
          <Avatar.Image size={48} source={{ uri: userImage }} />
        ) : (
          <Avatar.Image
            size={48}
            source={require("../../assets/images/avater.png")}
          />
        )}

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.profileName}>{userFullName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>
        <AntDesign name="right" size={18} color="black" style={{ marginLeft: "auto" }} />
      </TouchableOpacity>

      {/* Menu List */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleItemPress(item, index)}
          key={index}
          style={[
            styles.menuItem,
            activeItem === index ? styles.activeBarColor : {},
          ]}
        >
          {React.cloneElement(item.icon, {
            color: activeItem === index ? "white" : "black",
          })}
          <Text
            style={[
              styles.menuLabel,
              activeItem === index ? { color: "#fff" } : {},
            ]}
          >
            {item.label}
          </Text>
          <AntDesign
            name="right"
            size={18}
            color={activeItem === index ? "white" : "black"}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      ))}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>

      {/* Review Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={isReviewModalVisible}
        onRequestClose={() => setIsReviewModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate the App</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                  <MaterialIcons
                    name={star <= selectedRating ? "star" : "star-border"}
                    size={32}
                    color="#FFD700"
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Pressable onPress={() => setIsReviewModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "gray",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  activeBarColor: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  cancelText: {
    color: "blue",
    marginTop: 10,
  },
});
