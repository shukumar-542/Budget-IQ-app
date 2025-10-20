import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { store } from "../redux/store";

import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);
export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="InitialScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SecondScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />

        {/* FIX for (tabs) to remove title and show black back arrow on iOS */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTitle: "",
            headerTintColor: "#000",
            headerShadowVisible: false,
            headerBackTitle: "",
          }}
        />

        <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
        <Stack.Screen name="ForgerPassword" options={{ headerShown: false }} />
        <Stack.Screen
          name="AccountVerification"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Otp" options={{ headerShown: false }} />
        <Stack.Screen name="NewPassword" options={{ headerShown: false }} />
        <Stack.Screen
          name="IncrementDecrementAmount"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Subscriptions"
          options={{
            title: "Subscriptions Plans",
            headerTitleStyle: { fontWeight: "700", color: "#000" },
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="AccountInformation"
          options={{
            title: "Account Information",
            headerTitleStyle: { fontWeight: "700" },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="Currency"
          options={{
            title: "Currency",
            headerTitleStyle: { fontWeight: "700" },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerBackVisible: false,
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="TermsAndPolicies"
          options={{
            title: "Terms & Policies",
            headerTitleStyle: { fontWeight: "600" },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          options={{
            title: "Privacy Policy",
            headerTitleStyle: { fontWeight: "600" },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="ExpenseCategories"
          options={{
            title: "Expense Categories",
            headerTitleStyle: { fontWeight: "600" },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="IncomeCategories"
          options={{
            title: "Income Categories",
            headerTitleStyle: { fontWeight: "600" },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTintColor: "#000",
            headerBackTitle: "",
          }}
        />
      </Stack>
    </Provider>
  );
}
