import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const categories = [
  { id: "home", name: "Home", icon: "home" },
  { id: "CompanySalary", name: "Company Salary", icon: "cash-outline" },
  { id: "shop", name: "Shop", icon: "cart" },
  { id: "gift", name: "Gift", icon: "gift" },
  { id: "entertainment", name: "Entertainment", icon: "drama-masks" },
  { id: "car", name: "Car", icon: "car" },
  { id: "beauty", name: "Beauty", icon: "flower" },
];

const IncomeCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter()

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedCategories.includes(id);

  const handleSave = () => {
    console.log("Selected Categories:", selectedCategories);
    router.push("/DashboardScreen");
    // Handle your submit logic here (API call, navigation, etc.)
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCategory(item.id)}
      style={styles.item}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color="#20a074" />
      </View>
      <Text style={styles.label}>{item.name}</Text>
      <Icon
        name={
          isSelected(item.id) ? "checkbox-marked" : "checkbox-blank-outline"
        }
        size={24}
        color="#20a074"
        style={styles.checkbox}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
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
