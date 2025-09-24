import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  useGetAllMemberShipPlanQuery,
  useGetMembershipMutation,
} from "../redux/services/api";
const Subscriptions = () => {
  const { data: allPlans } = useGetAllMemberShipPlanQuery();
  const [getMembership, { isLoading }] = useGetMembershipMutation();
  const [textWidths, setTextWidths] = useState({});
  const [checkoutUrl, setCheckoutUrl] = useState(null);

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
    console.log(plan);
    if (plan.name.toLowerCase() === "free-trial") {
      try {
        // 1️⃣ Check if plans are loaded
        if (!allPlans?.result || allPlans.result.length === 0) {
          alert("No membership plans available. Please try again later.");
          return;
        }

        // 2️⃣ Find the plan from API that matches clicked plan name
        const matchedPlan = allPlans.result.find(
          (p) => p.name.toLowerCase() === plan.name.toLowerCase()
        );

        if (!matchedPlan) {
          alert(`The plan "${plan.name}" was not found. Please try again.`);
          return;
        }

        const selectedPlanId = matchedPlan._id;

        // 3️⃣ Call API to get the selected membership
        const response = await getMembership(selectedPlanId).unwrap();

        // 4️⃣ Check if response is valid
        if (!response || !response.result) {
          alert("Failed to fetch membership details. Please try again.");
          return;
        }

        //    5️⃣ Successful subscription
        router.push("/(tabs)");
        alert(`Subscribed to the ${plan.name} plan successfully!`);
      } catch (err) {
        Alert.alert(err);
      }
    } else {
      try {
        // 1️⃣ Check if plans are loaded
        if (!allPlans?.result || allPlans.result.length === 0) {
          alert("No membership plans available. Please try again later.");
          return;
        }

        // 2️⃣ Find the plan from API that matches clicked plan name
        const matchedPlan = allPlans.result.find(
          (p) => p.name.toLowerCase() === plan.name.toLowerCase()
        );

        if (!matchedPlan) {
          alert(`The plan "${plan.name}" was not found. Please try again.`);
          return;
        }

        const selectedPlanId = matchedPlan._id;

        // 3️⃣ Call API to get the selected membership
        const response = await getMembership(selectedPlanId).unwrap();
        const url = response.result?.url;
        setCheckoutUrl(url);
        // 4️⃣ Check if response is valid
        if (!response || !response.result) {
          alert("Failed to fetch membership details. Please try again.");
          return;
        }

        //    5️⃣ Successful subscription
        router.push("/(tabs)");
        alert(`Subscribed to the ${plan.name} plan successfully!`);
      } catch (err) {
        Alert.alert(err);
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "#4A90E2", // blue button
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3, // Android shadow
            alignSelf: "flex-start", // keep it left aligned like a back button
            margin: 10,
          }}
          onPress={() => router.push("Subscriptions")}
        >
          <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
            ← Back
          </Text>
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
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}></Text>
      <View style={styles.planContainer}>
        {plans?.map((plan) => {
          return (
            <View key={plan?.name} style={styles.planCard}>
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
                  style={[
                    styles.divider,
                    { width: textWidths[plan.name] || 0 },
                  ]}
                />
              </View>
              <Text style={styles.planDetails}>
                <Text style={styles.planDuration}>{plan?.duration}</Text>
                {plan?.price && plan.price.toLowerCase() !== "free" && (
                  <>
                    {" "}
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </>
                )}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleSubscription(plan);
                }}
              >
                <Text style={styles.buttonText}>{plan?.buttonText}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  planContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  planDuration: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B9E6C",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 14,
    color: "#1B9E6C",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1B9E6C",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  nameSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "#1B9E6C",
    marginTop: 4,
    borderRadius: 2,
  },
  planDetails: {
    padding: 12,
  },
});
