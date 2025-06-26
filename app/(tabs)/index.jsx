import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/iq.png";
import TotalSpentDonutChart from "../../components/Charts/TotalSpentDonutChart";
import { Colors } from "../../Constants/Colors";

const Index = () => {
  const router = useRouter()
  const customChartData = [
    { category: "Groceries", value: 333, color: "#7E49FF", icon: "food" }, // Different green
    { category: "Car", value: 333, color: "#FF2D55", icon: "car" }, // Different purple
    { category: "Home", value: 333, color: "#1BA26E", icon: "home" }, // Different red
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} />

        <Pressable onPress={()=>router.push("AccountInformation")}>
          <Avatar.Icon
            icon="account"
            size={40}
            style={{ backgroundColor: Colors.primary }}
          />
        </Pressable>
      </View>

      <View style={styles.tagLine}>
        <Text style={styles.text}>
          “Skipping one coffee = $5 closer to your goal”
        </Text>
      </View>

      <View style={styles.chartsContainer}>
        <TotalSpentDonutChart
          data={customChartData}
          totalSpent={1300}
          changeAmount={2000}
          radius={150}
          strokeWidth={60}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  chartsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagLine: {
    backgroundColor: "#B8E2D2",
    padding: 10,
    alignItems: "center",
    marginTop: 25,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
