import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { store } from "../redux/store";
const AppLayout = () => {
  return (
    <>

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
        <Stack.Screen name="Subscriptions" options={{
          title: 'Subscriptions Plans',
          headerTitleStyle: {
            fontWeight: "700",
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false
        }} />
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

export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <StatusBar barStyle={"dark-content"} />
        <AppLayout />
      </Provider>
    </>
  );
}
