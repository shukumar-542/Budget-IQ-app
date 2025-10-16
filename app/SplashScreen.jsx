// app/SplashScreenComponent.js
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
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
        }

        setTokenLoaded(true); // now API call will proceed
      } catch (err) {
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
          router.replace("/InitialScreen");
          return;
        }

        const successValue = data?.success;

        dispatch(saveApiSuccess(successValue));

        router.replace("/InitialScreen"); // route after splash
      } catch (err) {
        router.replace("/InitialScreen");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    processApiResponse();
  }, [tokenLoaded, isLoading, isError, data, error, dispatch, router]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0f172a" barStyle="light-content" />
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
