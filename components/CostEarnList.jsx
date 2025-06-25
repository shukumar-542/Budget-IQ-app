import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../Constants/Colors";

const CostEarnList = ({ data}) => {
  const router = useRouter()
  const SpecificCostItem = ({ icon, name, date, amount }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/IncrementDecrementAmount",
          params: {
            icon,
            name,
            date,
            amount,
          },
        });
      }}
    >
      <View>
        <View style={styles.itemContainer}>
          <View style={styles.iconAndText}>
            <Ionicons
              name={icon}
              color={Colors.primary}
              size={24}
              style={styles.iconBackground}
            />
            <View>
              <Text style={styles.itemName}>{name}</Text>
              <Text style={styles.itemDate}>{date}</Text>
            </View>
          </View>
          <Text style={styles.itemAmount}>{amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpecificCostItem
              icon={item.icon}
              name={item.name}
              date={item.date}
              amount={item.amount}
            />
          )}
        />
      </View>
    </View>
  );
};

export default CostEarnList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 2,
    overflow: "hidden",
    // elevation: 3,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBackground: {
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    padding: 5,
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemDate: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
