import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Currency = () => {
  const flags = {
    us: require("../assets/images/us.png"), 
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
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 30,
    height: 20, 
    marginRight: 15,
    resizeMode: 'contain',
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
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20, 
  },
});
