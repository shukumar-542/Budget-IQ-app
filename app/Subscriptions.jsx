import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";
import {
  useGetAllMemberShipPlanQuery,
  useGetMembershipMutation,
} from "../redux/services/api";
import {
  loadLastViewTime,
  saveCurrentViewTime,
} from "../redux/slices/SubscriptionSlice";

const Subscriptions = () => {
  const { data: allPlans } = useGetAllMemberShipPlanQuery();
  const [getMembership] = useGetMembershipMutation();
  const dispatch = useDispatch();
  const [textWidths, setTextWidths] = useState({});
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  useEffect(() => {
    dispatch(loadLastViewTime());
    dispatch(saveCurrentViewTime());
  }, [dispatch]);

  const plans = [
    {
      name: "Free-Trial",
      duration: "7 Days",
      price: "free",
      buttonText: "Select",
    },
    {
      name: "Monthly",
      duration: "$14.99/",
      price: "month",
      buttonText: "Purchase",
    },
    {
      name: "Yearly",
      duration: "$19.99/",
      price: "year",
      buttonText: "Purchase",
    },
  ];

  const handleLayout = (name, width) => {
    setTextWidths((prev) => ({ ...prev, [name]: width }));
  };

  const handleSubscription = async (plan) => {
    try {
      const matchedPlan = allPlans.result.find(
        (p) => p.name.toLowerCase() === plan.name.toLowerCase()
      );
      const selectedPlanId = matchedPlan._id;

      // Get response from backend
      const response = await getMembership(selectedPlanId).unwrap();

      console.log("Membership response:", response);

      // Check if response has URL for Stripe checkout
      if (response.result && response.result.url) {
        setCheckoutUrl(response.result.url);
      }
      // If no URL but success is true, navigate directly
      else if (response.success === true) {
        console.log("Direct subscription success");
        Alert.alert(response.message, [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ]);
      }
      // Handle other response formats
      else {
        console.log("Unexpected response format:", response);
        Alert.alert(response.message);
      }
    } catch (err) {
      console.log("Subscription error:", err);
      Alert.alert(err);
    }
  };

  const handlePaymentSuccess = (sessionId) => {
    console.log("Payment successful! Session ID:", sessionId);
    setCheckoutUrl(null);
    router.push("/(tabs)");
  };

  const handlePaymentCancel = () => {
    console.log("Payment canceled");
    setCheckoutUrl(null);
  };

  // ✅ Render WebView if checkout URL exists - Using Stripe's native UI
  if (checkoutUrl) {
    return (
      <WebView
        source={{ uri: checkoutUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          console.log("WebView message:", event.nativeEvent.data);
        }}
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          console.log("Navigation URL:", url);

          // Check for success patterns
          if (
            url.includes("success") ||
            url.includes("payment-success") ||
            url.includes("checkout/success") ||
            url.startsWith("myapp://success")
          ) {
            try {
              let sessionId = null;

              // Try to extract session_id from various URL formats
              const urlParts = url.split("?");
              if (urlParts.length > 1) {
                const params = new URLSearchParams(urlParts[1]);
                sessionId = params.get("session_id") || params.get("sessionId");
              }

              // Also try to extract from URL path
              if (!sessionId) {
                const sessionMatch = url.match(/cs_[a-zA-Z0-9_]+/);
                sessionId = sessionMatch ? sessionMatch[0] : null;
              }

              handlePaymentSuccess(sessionId);
              return false;
            } catch (error) {
              console.error("Error parsing success URL:", error);
              handlePaymentSuccess(null);
            }
          }

          // Check for cancel patterns
          if (
            url.includes("cancel") ||
            url.includes("payment-cancel") ||
            url.includes("checkout/cancel") ||
            url.startsWith("myapp://cancel")
          ) {
            handlePaymentCancel();
            return false;
          }
        }}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log("Should start load:", url);

          // Handle custom schemes
          if (url.startsWith("myapp://")) {
            console.log("Handling custom scheme:", url);

            if (url.includes("success")) {
              try {
                let sessionId = null;
                const urlParts = url.split("?");
                if (urlParts.length > 1) {
                  const params = new URLSearchParams(urlParts[1]);
                  sessionId =
                    params.get("session_id") || params.get("sessionId");
                }

                // Extract session ID from URL if not in params
                if (!sessionId) {
                  const sessionMatch = url.match(/cs_[a-zA-Z0-9_]+/);
                  sessionId = sessionMatch ? sessionMatch[0] : null;
                }

                handlePaymentSuccess(sessionId);
              } catch (error) {
                console.error("Error parsing custom success URL:", error);
                handlePaymentSuccess(null);
              }
              return false;
            }

            if (url.includes("cancel")) {
              handlePaymentCancel();
              return false;
            }

            return false; // Block all custom schemes
          }

          return true; // Allow normal web URLs
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error:", nativeEvent);
          Alert.alert("Error", "Failed to load payment page");
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView HTTP error:", nativeEvent);
        }}
      />
    );
  }

  // ✅ Render subscription plans
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose a Subscription Plan</Text>
      <View style={styles.planContainer}>
        {plans.map((plan) => (
          <View key={plan.name} style={styles.planCard}>
            <View style={styles.nameSection}>
              <Text
                style={styles.planName}
                onLayout={(event) =>
                  handleLayout(plan.name, event.nativeEvent.layout.width)
                }
              >
                {plan.name}
              </Text>
              <View
                style={[styles.divider, { width: textWidths[plan.name] || 0 }]}
              />
            </View>
            <Text style={styles.planDetails}>
              <Text style={styles.planDuration}>{plan.duration}</Text>
              {plan.price.toLowerCase() !== "free" && (
                <>
                  {" "}
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </>
              )}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubscription(plan)}
            >
              <Text style={styles.buttonText}>{plan.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  planContainer: { gap: 16 },
  planCard: {
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  planName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  planDuration: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B9E6C",
    marginBottom: 4,
  },
  planPrice: { fontSize: 14, color: "#1B9E6C", marginBottom: 16 },
  button: {
    backgroundColor: "#1B9E6C",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  nameSection: { alignItems: "center", marginBottom: 12 },
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "#1B9E6C",
    marginTop: 4,
    borderRadius: 2,
  },
  planDetails: { padding: 12 },
});
