import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../Constants/Colors";

const ExpenseIncome = ({ expenseData }) => {
  const router = useRouter()
  const CategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <TouchableOpacity onPress={() =>
        router.push({
          pathname: "/IncrementDecrementAmount", // or your target screen
          params: {
            icon: item.icon,
            amount: item.amount,
            id: item.id,
          },
        })
      }>
      <View style={styles.iconContainer}>
        <Ionicons name={item?.icon} size={25} color={Colors.primary} />
      </View>
      <Text style={styles.amountText}>{item?.amount}</Text>
    </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {expenseData.map((item) => (
          <CategoryItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

export default ExpenseIncome;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "center",
  },
  categoryItem: {
    width: "20%",
    alignItems: "center",
    marginBottom : 15
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
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E8B57",
    marginTop: 5,
    textAlign: "center",
  },
});
