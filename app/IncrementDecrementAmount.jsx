import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../Constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useCreateTransactionMutation } from "../redux/services/api";
import { useUserGetMeQuery } from "../redux/services/api";
const IncrementDecrementAmount = () => {
  const [createTransactions] = useCreateTransactionMutation();
  const navigation = useNavigation();
  const [amount, setAmount] = useState("-1000");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { id, name, image, categoryType } = useLocalSearchParams();
  console.log(categoryType);
  const { data: user } = useUserGetMeQuery();
  const userId = user?.data?._id;
  const formatDate = (d) =>
    d.toDateString() === new Date().toDateString() ? "Today" : d.toDateString();

  const createTransaction = async () => {
    try {
      const response = await createTransactions({
        amount,
        categoryId: id,
        userId,
      });
      router.push("/(tabs)/DashboardScreen");
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View style={styles.headerButtonText}>
          <Image
            source={{ uri: image }}
            resizeMode="cover"
            style={styles.iconImage}
          />
          <Text style={styles.headerText}>{name}</Text>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.row}>
        <View style={styles.label}>
          <FontAwesome5 name="money-bill-wave" size={16} />
          <Text style={styles.labelText}> Amount</Text>
        </View>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      {/* Date */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={styles.label}>
          <FontAwesome5 name="calendar" size={16} />
          <Text style={styles.labelText}> Date</Text>
        </View>
        <Text style={[styles.valueText, { color: "#3D8B3D" }]}>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Add Transaction Button */}
      <TouchableOpacity style={styles.button} onPress={createTransaction}>
        <Text style={styles.buttonText}>ADD TRANSACTION</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default IncrementDecrementAmount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerButtonText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    marginLeft: 6,
    fontSize: 15,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    marginTop: "auto",
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E8B57",
    textAlign: "right",
    width: 100,
  },
  iconImage: {
    width: 40,
    height: 40,
    // makes it round (optional)
    marginRight: 8, // spacing between image and name
  },
});
