import { MaterialCommunityIcons } from '@expo/vector-icons'; // Example icon library
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg'; // G for grouping, Path for arcs

// Data structure for segments
const chartData = [
  { category: 'Car', value: 500, color: '#6A1B9A', icon: 'car' }, // Purple
  { category: 'Home', value: 400, color: '#EF5350', icon: 'home' }, // Red
  { category: 'Groceries', value: 400, color: '#4CAF50', icon: 'food' }, // Green
];

const TotalSpentDonutChart = ({ data = chartData, radius = 100, strokeWidth = 30, totalSpent = 1300, changeAmount = 2000 }) => {
  const circumference = 2 * Math.PI * radius;
  const innerRadius = radius - strokeWidth / 2; // For drawing arcs in the center of the stroke

  // Calculate total value from data for correct percentage distribution
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = -90; // Start from the top (12 o'clock)

  const describeArc = (x, y, r, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return d;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0; // Adjust for SVG's 0 degree at 3 o'clock

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background circle (optional, but good for visual consistency) */}
        <Circle
          stroke="#eee"
          fill="none"
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2} // Adjust radius for background to align with segments
          strokeWidth={strokeWidth}
        />

        {data.map((segment, index) => {
          const segmentPercentage = (segment.value / totalValue) * 100;
          const segmentAngle = (segmentPercentage / 100) * 360;
          const endAngle = currentAngle + segmentAngle;

          const arcPath = describeArc(radius, radius, innerRadius, currentAngle, endAngle);

          // Calculate position for the icon
          const iconAngle = currentAngle + (segmentAngle / 2);
          const iconPosition = polarToCartesian(radius, radius, radius - strokeWidth / 2, iconAngle - 120); // Adjust icon position

          currentAngle = endAngle; // Update angle for the next segment

          return (
            <G key={index}>
              <Path
                d={arcPath}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Icon positioning */}
              <MaterialCommunityIcons
                name={segment.icon}
                size={radius / 4} // Adjust icon size based on radius
                color="white"
                style={{
                  position: 'absolute',
                  left: iconPosition.x - (radius / 8), // Adjust for icon centering
                  top: iconPosition.y - (radius / 8), // Adjust for icon centering
                }}
              />
            </G>
          );
        })}
      </Svg>

      {/* Center content */}
      <View style={[StyleSheet.absoluteFillObject, styles.center]}>
        <Text style={styles.totalSpentLabel}>Total Spent</Text>
        <Text style={styles.totalSpentValue}>${totalSpent}</Text>
        <Text style={styles.changeAmount}>
          {changeAmount > 0 ? `+$${changeAmount}` : `-$${Math.abs(changeAmount)}`}
          {changeAmount > 0 ? ' ↑' : ' ↓'}
        </Text>
      </View>
    </View>
  );
};

export default TotalSpentDonutChart;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalSpentLabel: {
    fontSize: 16,
    color: '#888',
  },
  totalSpentValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  changeAmount: {
    fontSize: 18,
    color: '#4CAF50', // Green for increase, you might want to dynamically change this
    fontWeight: 'bold',
  },
});