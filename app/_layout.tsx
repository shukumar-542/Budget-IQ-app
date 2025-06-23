import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return <>
  <StatusBar barStyle={"dark-content"}/>
  <Stack>
    <Stack.Screen name="InitialScreen" options={{ headerShown: false }}  />
    <Stack.Screen name="SecondScreen" options={{ headerShown: false }} />
    <Stack.Screen name="LoginScreen" options={{headerShown : false}} />
    <Stack.Screen name="(tabs)" options={{headerShown : false}} />
  </Stack>
  </>;
}
