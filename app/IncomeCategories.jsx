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
import { FullWindowOverlay } from "react-native-screens";

const IncomeCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();

  // Fetch categories from API
  const {
    data: incomeCategories,
    isLoading,
    isError,
  } = useGetAllCategoriesQuery("income");

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedCategories.includes(id);

  const handleSave = () => {
    console.log("Selected Categories:", selectedCategories);
    router.push("/DashboardScreen");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        toggleCategory(item._id);
        console.log("Category toggled:", item._id);
      }}
      style={styles.item}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: item.categoryImage }}
          onLoadStart={() => console.log("Loading image from URL:", item.categoryImage)}
          style={{ width: "100%", height: "100%", borderRadius: 4 }}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.label}>{item.name}</Text>
      <Icon
        name={
          isSelected(item._id) ? "checkbox-marked" : "checkbox-blank-outline"
        }
        size={24}
        color="#20a074"
        style={styles.checkbox}
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#20a074" />
      </View>
    );
  }

  if (isError || !incomeCategories?.result) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#333" }}>Failed to load categories.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={incomeCategories.result}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE CHANGE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncomeCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
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
