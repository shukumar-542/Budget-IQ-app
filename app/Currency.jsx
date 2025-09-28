import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useState } from "react";
import { useCurrencyMutation } from "../redux/services/api";
import { router } from "expo-router";

const Currency = () => {
  const [currency, { isLoading }] = useCurrencyMutation();
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const flags = {
    us: require("../assets/images/us.png"),
    au: require("../assets/images/aus.png"),
    gb: require("../assets/images/eng.png"),
    nz: require("../assets/images/aus.png"),
    eu: require("../assets/images/eu.png"),
  };

  const currencyData = [
    {
      id: "1",
      country: "United States of America",
      code: "USD",
      flag: flags.us,
    },
    { id: "2", country: "Australia", code: "AUD", flag: flags.au },
    { id: "3", country: "England", code: "GBP", flag: flags.gb },
    { id: "4", country: "New Zealand", code: "NZD", flag: flags.nz },
    { id: "5", country: "Europe", code: "EUR", flag: flags.eu },
  ];

  // 🔹 Handle API call
  const handleCurrency = async (selected) => {
    try {
      const result = await currency({
        currency: selected.code.toLowerCase(), // ✅ matches API
      }).unwrap();

      setSelectedCurrency(selected.code); // ✅ highlight selected
      Alert.alert("Success", result.message);

      router.push("/(tabs)");
    } catch (err) {
      console.error("Currency error:", err);
      Alert.alert("Error", "Something went wrong while setting currency");
    }
  };

  const CurrencyItem = ({ country, code, flag }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedCurrency === code && styles.selectedItem, // ✅ highlight if selected
      ]}
      onPress={() => handleCurrency({ country, code })}
      disabled={isLoading}
    >
      <View style={styles.leftContent}>
        <Image source={flag} style={styles.flag} />
        <Text
          style={[
            styles.countryName,
            selectedCurrency === code && styles.selectedText,
          ]}
        >
          {country}
        </Text>
      </View>
      <Text
        style={[
          styles.currencyCode,
          selectedCurrency === code && styles.selectedText,
        ]}
      >
        {code}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={currencyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CurrencyItem
            country={item.country}
            code={item.code}
            flag={item.flag}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 15,
    resizeMode: "contain",
  },
  countryName: {
    fontSize: 16,
    color: "#333",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
  },
  selectedItem: {
    backgroundColor: "#e6f7e6", // light green background
    borderRadius: 8,
  },
  selectedText: {
    color: "green", // highlight text in green
    fontWeight: "bold",
  },
});
