import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CostEarnList = ({ data }) => {
  const router = useRouter();

  const SpecificCostItem = ({ icon, name, date, amount }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/IncrementDecrementAmount",
          params: { icon, name, date, amount },
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
            <Text style={styles.itemDate}>{date}</Text>
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SpecificCostItem
            icon={item.icon} // pass categoryImage URL
            name={item.name}
            date={item.date}
            amount={item.amount}
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
