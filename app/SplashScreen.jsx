// app/SplashScreenComponent.js
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { useGetMessageWithTotalTransactionQuery } from "../redux/services/api";
import { loadTokenFromStorage } from "../redux/slices/authSlice";
import { saveApiSuccess } from "../redux/slices/messageSlice";
import { getToken } from "../utils/secureStore";

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [tokenLoaded, setTokenLoaded] = useState(false);

  const { data, isLoading, isError, error } =
    useGetMessageWithTotalTransactionQuery(undefined, {
      skip: !tokenLoaded,
    });

  useEffect(() => {
    const loadTokenAndInit = async () => {
      try {
        const storedToken = await getToken();

        if (storedToken) {
          dispatch(loadTokenFromStorage(storedToken));
        } else {
          console.log("No token found");
        }

        setTokenLoaded(true); // now API call will proceed
      } catch (err) {
        console.error("Error loading token:", err);
        setTokenLoaded(true);
      }
    };

    loadTokenAndInit();
  }, [dispatch]);

  useEffect(() => {
    const processApiResponse = async () => {
      if (!tokenLoaded || isLoading) return;

      try {
        if (isError) {
          console.error("API error:", error);
          router.replace("/InitialScreen");
          return;
        }

        console.log("API Response:", data);

        const successValue = data?.success;
        console.log("Saving to Redux:", successValue);

        dispatch(saveApiSuccess(successValue));

        router.replace("/InitialScreen"); // route after splash
      } catch (err) {
        console.error("SplashScreen error:", err);
        router.replace("/InitialScreen");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    processApiResponse();
  }, [tokenLoaded, isLoading, isError, data, error, dispatch, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00C46A" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
});
