import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, Text } from "react-native";
import { useGetTermsAndConditionsQuery } from "../redux/services/api";
import RenderHTML from "react-native-render-html";

const TermsAndPolicies = () => {
  const { width } = useWindowDimensions();
  const { data, error, isLoading } = useGetTermsAndConditionsQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading terms and conditions</Text>;

  // HTML content from API
  const htmlContent = data?.data?.[0]?.term || "<p>No terms available</p>";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndPolicies;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 20,
  },
});
