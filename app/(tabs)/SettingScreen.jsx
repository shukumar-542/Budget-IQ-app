import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../Constants/Colors";

const SettingScreen = () => {
  const [activeItem, setActiveItem] = useState(null);
  const navigation = useNavigation();
  const user = {
    name: "Shukumar Ghosh",
    email: "shukumar@gmail.com",
  };

  const menuItems = [
    {
      name: "Currency",
      icon: <Entypo name="wallet" size={20} color="black" />,
      label: "Currency",
    },
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
      icon: (
        <Ionicons name="shield-checkmark-outline" size={20} color="black" />
      ),
      label: "Terms & Policies",
    },
    // {
    //   name: 'ReviewTheApp',
    //   icon: <AntDesign name="like1" size={20} color="black" />,
    //   label: 'Review The App'
    // },
    {
      name: "DeleteAccount",
      icon: <Ionicons name="trash-bin-outline" size={20} color="black" />,
      label: "Delete Account",
    },
  ];

  const handleItemPress = (item, index) => {
    if (item.name === "DeleteAccount") {
      Alert.alert(
        "Confirm Delete",
        "Are you sure Delete this account?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              navigation.navigate("LoginScreen");
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }

    setActiveItem(index);
    navigation.navigate(item.name);
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
        <Avatar.Icon icon="account" size={48} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
        <AntDesign
          name="right"
          size={18}
          color="black"
          style={{ marginLeft: "auto" }}
        />
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
          {/* Conditionally change icon color here */}
          {React.cloneElement(item.icon, {
            color: activeItem === index ? "white" : "black", // Set color based on active state
          })}
          <Text
            style={[
              styles.menuLabel,
              activeItem === index ? { color: "#ffff" } : {},
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
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    color: "#ffff",
    borderRadius: 10,
  },
});
