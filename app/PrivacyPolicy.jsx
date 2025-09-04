import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { useGetPrivacyPolicyQuery } from "../redux/services/api";
import RenderHTML from "react-native-render-html";

const PrivacyPolicy = () => {
  const { width } = useWindowDimensions();
  const { data, isLoading, error } = useGetPrivacyPolicyQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#20a074" />
      </View>
    );
  }

  if (error || !data?.success) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Failed to load privacy policy.</Text>
      </View>
    );
  }

  const htmlContent = data.data[0].policy;

  const tagsStyles = {
    h1: { fontSize: 28, fontWeight: "bold", marginBottom: 12, color: "#333" },
    h2: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#333" },
    h3: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#333" },
    h4: { fontSize: 18, fontWeight: "bold", marginBottom: 6, color: "#333" },
    h5: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#333" },
    h6: { fontSize: 14, fontWeight: "bold", marginBottom: 2, color: "#333" },
    p: { fontSize: 16, marginBottom: 8, lineHeight: 22, color: "#555" },
    a: { color: "#20a074", textDecorationLine: "underline" },
    strong: { fontWeight: "bold" },
    b: { fontWeight: "bold" },
    em: { fontStyle: "italic" },
    i: { fontStyle: "italic" },
    u: { textDecorationLine: "underline" },
    s: { textDecorationLine: "line-through" },
    del: { textDecorationLine: "line-through" },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: "#ccc",
      paddingLeft: 12,
      color: "#666",
      fontStyle: "italic",
      marginVertical: 8,
    },
    code: {
      fontFamily: "monospace",
      backgroundColor: "#f4f4f4",
      padding: 4,
      borderRadius: 4,
    },
    pre: {
      fontFamily: "monospace",
      backgroundColor: "#f4f4f4",
      padding: 8,
      borderRadius: 4,
      marginVertical: 8,
    },
    ul: { paddingLeft: 20, marginBottom: 8 },
    ol: { paddingLeft: 20, marginBottom: 8 },
    li: { fontSize: 16, marginBottom: 4, lineHeight: 22 },
    hr: { borderBottomWidth: 1, borderBottomColor: "#ccc", marginVertical: 12 },
    table: { borderWidth: 1, borderColor: "#ccc", marginBottom: 12 },
    th: {
      fontWeight: "bold",
      padding: 6,
      borderWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "#f0f0f0",
    },
    td: { padding: 6, borderWidth: 1, borderColor: "#ccc" },
    img: {
      width: "100%",
      height: 200,
      resizeMode: "contain",
      marginVertical: 8,
    },
    span: { color: "#555" },
    div: { marginBottom: 8 },
    small: { fontSize: 12 },
    sup: { fontSize: 12, lineHeight: 12 },
    sub: { fontSize: 12, lineHeight: 12 },
    figure: { marginVertical: 8 },
    figcaption: { fontSize: 14, textAlign: "center", color: "#666" },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <RenderHTML
          contentWidth={width}
          source={{ html: htmlContent }}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollViewContent: { padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
