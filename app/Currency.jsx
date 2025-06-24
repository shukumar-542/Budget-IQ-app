import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Currency = () => {
  const flags = {
    us: require("../assets/images/us.png"), // Adjust path as needed
    au: require("../assets/images/aus.png"),
    gb: require("../assets/images/eng.png"),
    nz: require("../assets/images/aus.png"),
    bd: require("../assets/images/ban.png"),
    sa: require("../assets/images/sou.png"),
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
    { id: "5", country: "Bangladesh", code: "BDT", flag: flags.bd },
    { id: "6", country: "Saudi Arabia", code: "SAR", flag: flags.sa },
  ];

  const CurrencyItem = ({ country, code, flag }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => { /* Handle currency selection */ }}>
    <View style={styles.leftContent}>
      <Image source={flag} style={styles.flag} />
      <Text style={styles.countryName}>{country}</Text>
    </View>
    <Text style={styles.currencyCode}>{code}</Text>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
      {/* The header with back button and title will be handled by React Navigation Stack */}
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
        ItemSeparatorComponent={() => <View style={styles.separator} />} // Optional separator line
      />
    </SafeAreaView>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background for the list
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20, // Add some horizontal padding
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 30, // Adjust size as needed
    height: 20, // Adjust size as needed
    marginRight: 15,
    resizeMode: 'contain', // Ensures the image fits within the specified dimensions
  },
  countryName: {
    fontSize: 16,
    color: '#333',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0', // Light grey separator
    marginHorizontal: 20, // Match horizontal padding
  },
});
