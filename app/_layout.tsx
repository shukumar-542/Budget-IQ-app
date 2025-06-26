import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="InitialScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SecondScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
        <Stack.Screen name="ForgerPassword" options={{ headerShown: false }} />
        <Stack.Screen name="AccountVerification" options={{ headerShown: false }} />
        <Stack.Screen name="Otp" options={{ headerShown: false }} />
        <Stack.Screen name="NewPassword" options={{ headerShown: false }} />
        <Stack.Screen name="IncrementDecrementAmount" options={{ headerShown: false }} />
        <Stack.Screen
          name="AccountInformation"
          options={{
            title: "Account Information",
            headerTitleStyle: {
              fontWeight: "700",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Currency"
          options={{
            title: "Currency",
            headerTitleStyle: {
              fontWeight: "700",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="TermsAndPolicies"
          options={{
            title: "Terms & Policies",
            headerTitleStyle: {
              fontWeight: "600",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="ExpenseCategories"
          options={{
            title: "Expense Categories",
            headerTitleStyle: {
              fontWeight: "600",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="IncomeCategories"
          options={{
            title: "Income Categories",
            headerTitleStyle: {
              fontWeight: "600",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
      
      </Stack>
    </>
  );
}
