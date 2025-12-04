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
} from "../redux/services/api";
import { saveApiSuccess } from "../redux/slices/messageSlice";

const Subscriptions = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: allPlans, isLoading: plansLoading } = useGetAllMemberShipPlanQuery();
  const [getMembership, { isLoading: membershipLoading }] = useGetMembershipMutation();

  const [triggerGetMessages, { data }] = useLazyGetMessageWithTotalTransactionQuery();
  const [textWidths, setTextWidths] = useState({});
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [processingPlan, setProcessingPlan] = useState(null);

  const navigateWithCallback = (callback, delay = 1000) => {
    const interval = setInterval(() => {
      const ready = callback(); 
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
    if (processingPlan) return;
    setProcessingPlan(plan.name);

    try {
      if (!allPlans?.result || allPlans.result.length === 0) {
        Alert.alert("Error", "No membership plans available. Please try again later.");
        return;
      }

      const matchedPlan = allPlans.result.find(p => p.name.toLowerCase() === plan.name.toLowerCase());

      if (!matchedPlan) {
        Alert.alert("Error", `The plan "${plan.name}" was not found. Please try again.`);
        return;
      }

      const selectedPlanId = matchedPlan._id;
      const response = await getMembership(selectedPlanId).unwrap();

      if (!response || !response.result) {
        Alert.alert("Error", "Failed to fetch membership details. Please try again.");
        return;
      }

      await runAnotherAsyncFunction();

      if (plan.name.toLowerCase() === "free-trial") {
        Alert.alert("Success", `Subscribed to the ${plan.name} plan successfully!`, [
          {
            text: "OK",
            onPress: () => {
              navigateWithCallback(() => true, 1000);
            },
          },
        ]);
      } else {
        const checkoutUrl = response.result?.url;
        if (checkoutUrl) {
          setCheckoutUrl(checkoutUrl);
        } else {
          Alert.alert("Error", "Checkout URL not found. Please try again.");
        }
      }
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "An error occurred while processing your subscription. Please try again.";
      Alert.alert("Subscription Error", errorMessage);
    } finally {
      setTimeout(() => {
        setProcessingPlan(null);
      }, 1000);
    }
  };

  const runAnotherAsyncFunction = async () => {
    try {
      const result = await triggerGetMessages().unwrap();
      dispatch(saveApiSuccess(result.success));
    } catch (error) {}
  };

  const handleBackFromWebView = () => {
    setCheckoutUrl(null);
    setProcessingPlan(null);
  };

  const handlePaymentSuccess = () => {
    setCheckoutUrl(null);
    setProcessingPlan(null);
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
              navigateWithCallback(() => true, 1000);
            },
          },
        ]
      );
    }, 30000);
  };

  const handlePaymentCancel = () => {
    setCheckoutUrl(null);
    setProcessingPlan(null);
    Alert.alert("Payment Canceled", "Your payment has been canceled. You can try again anytime.");
  };

  if (checkoutUrl) {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B9E6C" />
          <Text style={styles.loadingText}>Activating your subscription...</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
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
          onError={(error) => handleBackFromWebView()}
        />
      </View>
    );
  }

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
        {allPlans?.result?.map((plan) => {
          const isProcessing = processingPlan === plan.name;
          const isAnyProcessing = processingPlan !== null;

          return (
            <View key={plan.name} style={styles.planCard}>
              <View style={styles.nameSection}>
                <Text
                  style={styles.planName}
                  onLayout={(event) =>
                    handleLayout(plan.name, event.nativeEvent.layout.width)
                  }
                >
                  {plan.label || plan.name} 
                </Text>
                <View
                  style={[styles.divider, { width: textWidths[plan.name] || 0 }]}
                />
              </View>

              <Text style={styles.planDetails}>
                <Text style={styles.planDuration}>{plan.label}</Text> 
              </Text>

              <TouchableOpacity
                style={[styles.button, isAnyProcessing && !isProcessing && styles.buttonDisabled]}
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
                  <Text style={styles.buttonText}>{plan.name === "free-trial" ? "Start Free Trial" : "Purchase"}</Text>
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
});
