import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const DonutChart = ({ percentage = 75, radius = 80, strokeWidth = 20, color = "#fbd203" }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          stroke="#eee"
          fill="none"
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${radius}, ${radius}`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, styles.center]}>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.totalLabel}>Total</Text>
      </View>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  percentage: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 12,
    color: "#888",
  },
});
