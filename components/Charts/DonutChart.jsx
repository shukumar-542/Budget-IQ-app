import { ScrollView, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

const DonutChart = () => {
  const widthAndHeight = 250;

  const series = [430, 321, 185, 123]; // values only
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00']; // colors only

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Basic</Text>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
        />

        <Text style={styles.title}>Doughnut</Text>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.45}
          coverFill={'#FFF'}
        />
      </View>
    </ScrollView>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
});
