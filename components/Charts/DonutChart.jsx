import { View } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

const DonutChart = () => {
  const radius = 100;
  const innerRadius = 60;
  const center = radius;
  const data = [
    { value: 30, color: "#9C27B0" },
    { value: 40, color: "#F44336" },
    { value: 30, color: "#4CAF50" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  let startAngle = 0;

  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const createArcPath = (startAngle, sweepAngle, rOuter, rInner) => {
    const startOuter = polarToCartesian(center, center, rOuter, startAngle);
    const endOuter = polarToCartesian(center, center, rOuter, startAngle + sweepAngle);
    const startInner = polarToCartesian(center, center, rInner, startAngle + sweepAngle);
    const endInner = polarToCartesian(center, center, rInner, startAngle);

    const largeArcFlag = sweepAngle > 180 ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      "Z",
    ].join(" ");
  };

  const slices = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const path = createArcPath(startAngle, angle, radius, innerRadius);
    const slice = <Path key={index} d={path} fill={item.color} />;
    startAngle += angle;
    return slice;
  });

  return (
    <View >
      <Svg width={radius * 2} height={radius * 2}>
        <G>{slices}</G>
        <G x={center} y={center}>
          <SvgText
            y={-10}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
          >
            Total Spent
          </SvgText>
          <SvgText
            y={10}
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
          >
            $1300
          </SvgText>
          <SvgText
            y={30}
            textAnchor="middle"
            fontSize="12"
            fill="#4CAF50"
          >
            +$2000 ↑
          </SvgText>
        </G>
      </Svg>
    </View>
    
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
