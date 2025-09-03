import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, Text } from "react-native";
import { useGetPrivacyPolicyQuery } from "../redux/services/api";
import RenderHTML from "react-native-render-html";

const PrivacyPolicy = () => {
  const { width } = useWindowDimensions();
  const { data, error, isLoading } = useGetPrivacyPolicyQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading privacy policy</Text>;

  const htmlContent = data?.data?.[0]?.policy || "<p>No policy available</p>";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 20,
  },
});
