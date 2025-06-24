import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../Constants/Colors";

const ExpenseIncome = ({ expenseData }) => {

  const CategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={item?.icon} size={25} color={Colors.primary} />
      </View>
      <Text style={styles.amountText}>{item?.amount}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={expenseData}
        numColumns={5}
        keyExtractor={(item) => item?.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <CategoryItem item={item} />}
      />
    </View>
  );
};

export default ExpenseIncome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItem: {
    margin: 5,
    width : "17%",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#E0F2E9",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // You can add specific padding or sizing for the icon if needed
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E8B57",
    marginTop: 5,
  },
});
