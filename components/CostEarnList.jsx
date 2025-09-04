import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
const CostEarnList = ({ data }) => {
  const router = useRouter();
  useEffect(() => {}, [data]);
  const SpecificCostItem = ({
    icon,
    name,
    createdAt,
    amount,
    transactionId,
    categoryType,
  }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/IncrementDecrementAmount",
          params: {
            image: icon,
            name,
            createdAt,
            ammount: amount,
            transactionId,
            categoryType,
          },
        });
      }}
    >
      <View style={styles.itemContainer}>
        <View style={styles.iconAndText}>
          {/* Replace Ionicons with Image */}
          <Image
            source={{ uri: icon }} // icon is now categoryImage URL
            style={styles.iconImage}
          />
          <View>
            <Text style={styles.itemName}>{name}</Text>
            <Text style={styles.itemDate}>{createdAt?.split("T")[0]}</Text>
          </View>
        </View>
        <Text style={styles.itemAmount}>{amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.transactionId.toString()}
        renderItem={({ item }) => (
          <SpecificCostItem
            icon={item.icon}
            name={item.name}
            createdAt={item.createdAt} // pass the original date
            amount={item.amount}
            transactionId={item.transactionId}
            categoryType={item.categoryType}
          />
        )}
      />
    </View>
  );
};

export default CostEarnList;

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconAndText: { flexDirection: "row", alignItems: "center" },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#e8f5e9", // optional placeholder background
  },
  itemName: { fontSize: 16, fontWeight: "500", color: "#333" },
  itemDate: { fontSize: 13, color: "#777", marginTop: 2 },
  itemAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
});
