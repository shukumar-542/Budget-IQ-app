import { useNavigation } from "expo-router";
import { useState, useCallback } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/iq.png";
import ExpenseIncome from "../../components/Charts/ExpenseIncome";
import CostEarnList from "../../components/CostEarnList";
import Button from "../../components/UI/Button";
import {
  useGetAllCategoriesWithSumQuery,
  useGetSpecificTransactionRecentQuery,
} from "../../redux/services/api";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

const DashboardScreen = () => {


  // --- STATE ---
  const [type, setType] = useState("expenses");
  const [expense, setExpense] = useState("expenses");
  const [limit, setLimit] = useState(1000);
  const [value, setValue] = useState("month");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "This Month", value: "month" },
    { label: "This Week", value: "week" },
    { label: "This Year", value: "year" },
  ]);
  const [savedCategories, setSavedCategories] = useState([]);

  const navigation = useNavigation();

  // --- API QUERIES ---
  const { data: allCategoriesWithSum, refetch: refetchCategories } =
    useGetAllCategoriesWithSumQuery(
      { type, time: value, savedCategory: savedCategories },
      { refetchOnMountOrArgChange: true }
    );

  const { data: specificTransactionRecent } =
    useGetSpecificTransactionRecentQuery(
      { type, limit },
      { refetchOnMountOrArgChange: true }
    );

  // --- FETCH SAVED CATEGORIES + REFETCH ---
  useFocusEffect(
    useCallback(() => {
      const fetchSavedCategories = async () => {
        try {
          const storedCategories = await SecureStore.getItemAsync(
            type === "expenses"
              ? "selectedExpenseCategories"
              : "selectedIncomeCategories"
          );
          const categories = JSON.parse(storedCategories || "[]");
          setSavedCategories(categories);

          if (refetchCategories) {
            refetchCategories();
          }
        } catch (error) {}
      };

      fetchSavedCategories();
    }, [type, value])
  );

  // --- TRANSFORM DATA ---
  const transformedSpecificTransactionRecent =
    specificTransactionRecent?.result?.map((tx) => ({
      transactionId: tx._id,
      name: tx.category?.name || "Unknown",
      icon: tx.category?.categoryImage || null,
      amount: `$${Math.abs(tx.amount)}`,
      userId: tx.userId,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
      categoryType: tx.category?.type || "unknown",
    })) || [];

  const expenseData =
    allCategoriesWithSum?.result
      .filter((cat) => cat.type === "expenses")
      .map((cat) => ({
        transactionId: cat._id,
        name: cat.name,
        icon: cat.categoryImage,
        amount: `$${cat.totalAmount}`,
        userId: cat.userId,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        categoryType: cat.type,
      })) || [];

  const incomeData =
    allCategoriesWithSum?.result
      .filter((cat) => cat.type === "income")
      .map((cat) => ({
        transactionId: cat._id,
        name: cat.name,
        icon: cat.categoryImage,
        amount: `$${cat.totalAmount}`,
        userId: cat.userId,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        categoryType: cat.type,
      })) || [];

  // --- RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={logo} />
        <View style={styles.dropdownContainers}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select Time Range"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
          />
        </View>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setExpense("expenses");
            setType("expenses");
          }}
          isActive={expense === "expenses"}
        >
          Expenses
        </Button>
        <Button
          onPress={() => {
            setExpense("income");
            setType("income");
          }}
          isActive={expense === "income"}
        >
          Income
        </Button>
      </View>

      {/* Charts & Specific Transaction List */}
      {expense === "expenses" ? (
        <>
          <ExpenseIncome expenseData={expenseData} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listText}>Specific Cost</Text>
            <CostEarnList data={transformedSpecificTransactionRecent} />
          </View>
        </>
      ) : (
        <>
          <ExpenseIncome expenseData={incomeData} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listText}>Specific Earn</Text>
            <CostEarnList data={transformedSpecificTransactionRecent} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownContainers: {
    margin: 10,
    zIndex: 1000,
    width: 130,
  },
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownBox: {
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginVertical: 25,
  },
  listText: {
    fontSize: 22,
    fontWeight: "700",
    padding: 10,
  },
});
