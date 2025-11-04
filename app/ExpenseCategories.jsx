import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import RemoteSvg from "../components/RemoteSvg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useGetAllCategoriesQuery } from "../redux/services/api";
import * as SecureStore from "expo-secure-store";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ExpensesCategories = () => {
  const insets = useSafeAreaInsets();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const router = useRouter();

  // Fetch expense categories from API
  const {
    data: expenseCategories,
    isLoading,
    isError,
  } = useGetAllCategoriesQuery("expenses");

  // After API loads, fetch saved selections from SecureStore
  useEffect(() => {
    const loadSelections = async () => {
      if (expenseCategories?.result?.length) {
        try {
          const storedCategories = await SecureStore.getItemAsync(
            "selectedExpenseCategories"
          );
          if (storedCategories) {
            const storedIds = JSON.parse(storedCategories);
            const validIds = storedIds.filter((id) =>
              expenseCategories.result.some((cat) => cat._id === id)
            );
            setSelectedCategories(validIds);
          }
        } catch {}
        setApiLoaded(true);
      }
    };
    loadSelections();
  }, [expenseCategories]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedCategories.includes(id);

  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    try {
      await SecureStore.setItemAsync(
        "selectedExpenseCategories",
        JSON.stringify(selectedCategories)
      );
      router.push("/DashboardScreen");
    } catch {}
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCategory(item._id)}
      style={styles.item}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {item.categoryImage ? (
          <RemoteSvg uri={item.categoryImage} width={40} height={40} />
        ) : (
          <Icon name="image-off" size={24} color="#999" />
        )}
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

  if (isLoading || !apiLoaded) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#20a074" />
      </View>
    );
  }

  if (isError || !expenseCategories?.result?.length) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: "#333" }}>Failed to load categories.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <FlatList
        data={expenseCategories.result}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 16,
        }}
      />
      <TouchableOpacity
        style={[styles.saveButton, { marginBottom: insets.bottom + 20 }]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>SAVE CHANGES</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExpensesCategories;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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
  image: { width: "100%", height: "100%", borderRadius: 4 },
  label: { flex: 1, fontSize: 16, color: "#333" },
  checkbox: { marginRight: 4 },
  saveButton: {
    backgroundColor: "#20a074",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
