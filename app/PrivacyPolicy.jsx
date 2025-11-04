import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  View,
  Text,
  StatusBar,
} from "react-native";
import { useGetPrivacyPolicyQuery } from "../redux/services/api";
import RenderHTML from "react-native-render-html";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PrivacyPolicy = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets(); // get safe area insets dynamically
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

  const htmlContent = data?.data?.[0]?.policy || "";
  const htmlContentMessage = data?.message || "No privacy policy available.";
  const tagsStyles = {
    h1: { fontSize: 28, fontWeight: "bold", marginBottom: 12, color: "#333" },
    h2: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#333" },
    p: { fontSize: 16, marginBottom: 8, lineHeight: 22, color: "#555" },
    a: { color: "#20a074", textDecorationLine: "underline" },
    strong: { fontWeight: "bold" },
    em: { fontStyle: "italic" },
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
  };

  return (
    <SafeAreaView style={[styles.safeArea]} >
      {/* Make StatusBar non-translucent so SafeAreaView works correctly */}
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
      />

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
  safeArea: {
    top: 0,
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
