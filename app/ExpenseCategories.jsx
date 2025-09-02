import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useGetAllCategoriesQuery } from "../redux/services/api";

const ExpensesCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();

  // Fetch expense categories from API
  const {
    data: expenseCategories,
    isLoading,
    isError,
  } = useGetAllCategoriesQuery("expenses");

  // Toggle category selection
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  // Check if category is selected
  const isSelected = (id) => selectedCategories.includes(id);

  // Save button handler
  const handleSave = () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category."); // user feedback
      return;
    }
    console.log("Selected Categories:", selectedCategories);
    router.push("/DashboardScreen");
  };

  // Render each category item
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleCategory(item._id)}
        style={styles.item}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {item.categoryImage ? (
            <Image
              source={{ uri: item.categoryImage }} // backend must return full URL
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Icon name="image-off" size={24} color="#999" />
          )}
        </View>
        <Text style={styles.label}>{item.name}</Text>
        <Icon
          name={isSelected(item._id) ? "checkbox-marked" : "checkbox-blank-outline"}
          size={24}
          color="#20a074"
          style={styles.checkbox}
        />
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#20a074" />
      </View>
    );
  }

  // Error state
  if (isError || !expenseCategories?.result?.length) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: "#333" }}>Failed to load categories.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenseCategories.result}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE CHANGES</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpensesCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#e4f3ec",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  checkbox: {
    marginRight: 4,
  },
  saveButton: {
    backgroundColor: "#20a074",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 24,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
