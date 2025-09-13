import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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
    console.log(allPlans);
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
    if (plan.name == "Monthly") {
      setCheckoutUrl(
        "https://checkout.stripe.com/c/pay/cs_test_a1s7EKTiFF9BY31hgePQoPOakjRxQQOa7NMEai3flqvz17aNLob8XJEhDZ#fidkdWxOYHwnPyd1blpxYHZxWjA0TWA8T1VOSE1UVWZ3fUFdUHdVf31nZFNXfWhxUFZcbTdONGxiST1XNGFKXDE0UTFfZkRDMFNJMURqY0x9MUtLNk4zSkZsckgzNnBfdUAyPX0yfExvNV1SNTVWRkp9SXBwXCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
      );
    } else {
      try {
        if (!allPlans?.result) {
          alert("Plans are not loaded yet. Please try again.");
          return;
        }

        const matchedPlan = allPlans.result.find(
          (p) => p.name.toLowerCase() === plan.name.toLowerCase()
        );

        if (!matchedPlan) {
          alert("Selected plan not found.");
          return;
        }

        const selectedPlanId = matchedPlan._id;

        // Get Stripe Checkout URL from backend
        const response = await getMembership(selectedPlanId).unwrap();
        if (response) {
          router.push("/(tabs)");
        }
      } catch (err) {
        console.log("Subscription error:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  // ✅ Render WebView if checkout URL exists
  if (checkoutUrl) {
    return (
      <View style={{ flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: "#eee",
            alignItems: "center",
          }}
          onPress={() => router.push("Subscriptions")} // Navigate back
        >
          <Text style={{ fontSize: 16 }}>Back</Text>
        </TouchableOpacity>

        {/* WebView */}
        <WebView
          source={{ uri: checkoutUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => {
            const url = navState.url;

            // Intercept success URL
            if (url.startsWith("https://your-backend.com/payment-success")) {
              const params = new URLSearchParams(url.split("?")[1]);
              const sessionId = params.get("session_id");

              console.log("Payment successful! Session ID:", sessionId);

              setCheckoutUrl(null);
              router.push("/(tabs)");
            }

            // Intercept cancel URL
            if (url.startsWith("https://your-backend.com/payment-cancel")) {
              console.log("Payment canceled");
              setCheckoutUrl(null);
            }
          }}
        />
      </View>
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
