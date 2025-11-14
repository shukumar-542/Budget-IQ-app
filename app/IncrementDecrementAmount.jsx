import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import RemoteSvg from "../components/RemoteSvg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../Constants/Colors";
import {
  useCreateTransactionMutation,
  useUserGetMeQuery,
  useGetUpdateTransactionMutation,
} from "../redux/services/api";

const IncrementDecrementAmount = () => {
  const [updateTransaction] = useGetUpdateTransactionMutation();
  const [createTransactions] = useCreateTransactionMutation();
  const navigation = useNavigation();
  const [amount, setAmount] = useState("0");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { id, name, image, categoryType, transactionId, ammount, fromTab } =
    useLocalSearchParams();
  const { data: user } = useUserGetMeQuery();
  const userId = user?.data?._id;

  const formatDate = (d) =>
    d.toDateString() === new Date().toDateString() ? "Today" : d.toDateString();

  useEffect(() => {
    if (ammount) {
      setAmount(ammount.toString());
    }
  }, [ammount]);

  const handleTransaction = async () => {
    try {
      if (!amount || parseInt(amount) <= 0) {
        alert("Amount must be greater than 0");
        return;
      }

      if (transactionId) {
        await updateTransaction({
          amount: parseInt(amount),
          transactionId,
        });
      } else {
        await createTransactions({
          amount: parseInt(amount),
          categoryId: id,
          userId,
        });
      }

      if (fromTab) {
        router.push(`/(tabs)/DashboardScreen?tab=${fromTab}`);
      } else {
        router.push("/(tabs)/DashboardScreen");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          {console.log(image)}
          <View style={styles.headerButtonText}>
            <View style={{ marginRight: 8, backgroundColor: "#E0F2E9" }}>
              {image?.endsWith(".svg") ? (
                <RemoteSvg uri={image} width={40} height={40} />
              ) : (
                <Image
                  source={{ uri: image }}
                  resizeMode="cover"
                  style={styles.iconImage}
                />
              )}
            </View>
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
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setAmount(numericValue);
            }}
            keyboardType="numeric"
          />
        </View>

        {/* Date */}
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

        <TouchableOpacity style={styles.button} onPress={handleTransaction}>
          <Text style={styles.buttonText}>
            {transactionId ? "MODIFY TRANSACTION" : "ADD TRANSACTION"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    marginRight: 8,
  },
});
