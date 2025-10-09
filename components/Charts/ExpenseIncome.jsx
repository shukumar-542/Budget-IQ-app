import { Image, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { create } from "ionicons/icons";
const ExpenseIncome = ({ expenseData }) => {
  const router = useRouter();

  const CategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/IncrementDecrementAmount",
            params: {
              id: item.transactionId,
              name: item.name,
              image: item.icon,
              fromTab: item.categoryType
            },

          })
        }
      >
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: item?.icon }}
            style={styles.iconImage}
            resizeMode="cover" // make image fill container
          />
        </View>
        <Text style={styles.amountText}>{item?.amount}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.listContainer}>
      {expenseData.map((item) => (
        <CategoryItem key={item.transactionId} item={item} />
      ))}
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
  },
  categoryItem: {
    width: "20%",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: "#E0F2E9",
    borderRadius: 10,
    padding: 0, // remove padding to allow full fill
    width: 60, // container width
    height: 60, // container height
    overflow: "hidden", // ensures image doesn't spill out
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  iconImage: {
    width: "100%",
    height: "100%",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E8B57",
    marginTop: 5,
    textAlign: "center",
  },
});
