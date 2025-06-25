import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/iq.png";
import { Colors } from "../../Constants/Colors";

const screenWidth = Dimensions.get("window").width;

const Index = () => {
  const data = [
    {
      name: "A",
      population: 50,
      color: "#fbd203",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "B",
      population: 30,
      color: "#ffb300",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "C",
      population: 20,
      color: "#ff9100",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} />
        <Avatar.Icon
          icon="account"
          size={40}
          style={{ backgroundColor: Colors.primary }}
        />
      </View>

      <View style={styles.tagLine}>
        <Text style={styles.text}>
          “Skipping one coffee = $5 closer to your goal”
        </Text>
      </View>

      <View>
        <PieChart
          data={data}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagLine: {
    backgroundColor: "#B8E2D2",
    padding: 10,
    alignItems: "center",
    marginTop: 15,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
