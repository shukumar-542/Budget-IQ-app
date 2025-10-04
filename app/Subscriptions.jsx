import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
  useLazyGetMessageWithTotalTransactionQuery,
  useCurrencyMutation,
} from "../redux/services/api";
import { saveApiSuccess } from "../redux/slices/messageSlice";

const Subscriptions = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { data: allPlans, isLoading: plansLoading } =
    useGetAllMemberShipPlanQuery();
  const [getMembership, { isLoading: membershipLoading }] =
    useGetMembershipMutation();

  const [triggerGetMessages, { data }] =
    useLazyGetMessageWithTotalTransactionQuery();

  const [textWidths, setTextWidths] = useState({});
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [processingPlan, setProcessingPlan] = useState(null); // Track which plan is being processed

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
  const navigateWithCallback = (callback, delay = 1000) => {
    const interval = setInterval(() => {
      const ready = callback(); // run your check
      if (ready) {
        clearInterval(interval);
        router.push("Currency");
      }
    }, delay);
  };

  const handleLayout = (name, width) => {
    setTextWidths((prev) => ({ ...prev, [name]: width }));
  };

  const handleSubscription = async (plan) => {
    // Prevent multiple clicks while processing
    if (processingPlan) return;

    setProcessingPlan(plan.name);

    try {
      // 1️⃣ Check if plans are loaded
      if (!allPlans?.result || allPlans.result.length === 0) {
        Alert.alert(
          "Error",
          "No membership plans available. Please try again later."
        );
        return;
      }

      // 2️⃣ Find the plan from API that matches clicked plan name
      const matchedPlan = allPlans.result.find(
        (p) => p.name.toLowerCase() === plan.name.toLowerCase()
      );

      if (!matchedPlan) {
        Alert.alert(
          "Error",
          `The plan "${plan.name}" was not found. Please try again.`
        );
        return;
      }

      const selectedPlanId = matchedPlan._id;

      // 3️⃣ Call API to get the selected membership
      const response = await getMembership(selectedPlanId).unwrap();

      // 4️⃣ Check if response is valid
      if (!response || !response.result) {
        Alert.alert(
          "Error",
          "Failed to fetch membership details. Please try again."
        );
        return;
      }

      // ✅ Run your extra async function before routing
      await runAnotherAsyncFunction();
      // 5️⃣ Save API response to Redux store

      // 6️⃣ Handle different plan types
      if (plan.name.toLowerCase() === "free-trial") {
        // For free trial, navigate directly
        Alert.alert(
          "Success",
          `Subscribed to the ${plan.name} plan successfully!`,
          [
            {
              text: "OK",
              onPress: () => {
                navigateWithCallback(() => {
                  // put your callback condition here
                  // return true when ready to navigate
                  return true; // example: instantly ready, just for demo
                }, 1000);
              },
            },
          ]
        );
      } else {
        // For paid plans, open checkout URL
        const checkoutUrl = response.result?.url;

        if (checkoutUrl) {
          setCheckoutUrl(checkoutUrl);
        } else {
          Alert.alert("Error", "Checkout URL not found. Please try again.");
        }
      }
    } catch (err) {
      // Handle different error types
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "An error occurred while processing your subscription. Please try again.";

      Alert.alert("Subscription Error", errorMessage);
    } finally {
      // Reset processing state after a delay to prevent rapid clicking
      setTimeout(() => {
        setProcessingPlan(null);
      }, 1000);
    }
  };
  const runAnotherAsyncFunction = async () => {
    try {
      const result = await triggerGetMessages().unwrap();

      // ✅ Save only the `success` value to Redux
      dispatch(saveApiSuccess(result.success));
    } catch (error) {}
  };

  // Handle back from WebView
  const handleBackFromWebView = () => {
    setCheckoutUrl(null);
    setProcessingPlan(null);
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    setCheckoutUrl(null);
    setProcessingPlan(null);

    // show loader for 30 seconds
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Payment Successful",
        "Your subscription has been activated successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              navigateWithCallback(() => {
                // return true to stop the interval
                return true;
              }, 1000);
            },
          },
        ]
      );
    }, 30000); // existing 30 sec wait
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setCheckoutUrl(null);
    setProcessingPlan(null);

    Alert.alert(
      "Payment Canceled",
      "Your payment has been canceled. You can try again anytime."
    );
  };

  // ✅ Render WebView if checkout URL exists
  if (checkoutUrl) {
    // ✅ Show loader when activating subscription
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B9E6C" />
          <Text style={styles.loadingText}>
            Activating your subscription...
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {/* WebView */}
        <WebView
          source={{ uri: checkoutUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => {
            const url = navState.url;

            if (url.includes("/success")) {
              handlePaymentSuccess();
            }
            if (url.includes("/error")) {
              handlePaymentCancel();
            }
          }}
          onError={(error) => {
            handleBackFromWebView();
          }}
        />
      </View>
    );
  }

  // Show loading indicator while plans are loading
  if (plansLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B9E6C" />
        <Text style={styles.loadingText}>Loading subscription plans...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>

      <View style={styles.planContainer}>
        {plans?.map((plan) => {
          const isProcessing = processingPlan === plan.name;
          const isAnyProcessing = processingPlan !== null;

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
                style={[
                  styles.button,
                  isAnyProcessing && !isProcessing && styles.buttonDisabled,
                ]}
                onPress={() => handleSubscription(plan)}
                disabled={isAnyProcessing}
              >
                {isProcessing ? (
                  <View style={styles.buttonLoadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                      Processing...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>{plan?.buttonText}</Text>
                )}
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
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
    shadowOffset: { width: 0, height: 2 },
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
    minHeight: 50,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: "flex-start",
    margin: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
