import { StyleSheet, Text, View } from "react-native";

const Subscriptions = () => {
  const plans = [
    {
      name: "Free Trail",
      limit: "7",
      price: "free",
    },
    {
      name: "Monthly",
      limit: "1",
      price: "14.99",
    },
    {
      name: "Yearly",
      limit: "12",
      price: "19.99",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.planContainer}>
        {plans?.map((plan) => {
          return (
            <View key={plan?.name} style={styles.planCard}>
              <Text>{plan?.name}</Text>
              <Text>{plan?.price}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  planContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  planCard: {
    backgroundColor: "white",
    width: "30%",
    width: "100%",
    borderRadius: 12,
    textAlign: "center",
    alignItems: "center",
    padding: 24,
    shadowRadius: 4,
    elevation: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
  },
});
