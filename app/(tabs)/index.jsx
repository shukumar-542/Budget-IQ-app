import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserGetMeQuery } from "../../redux/services/api";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import logo from "../../assets/images/iq.png";
import TotalSpentDonutChart from "../../components/Charts/TotalSpentDonutChart";
import {
  api,
  useGetMessageWithTotalTransactionQuery,
  useIqBuddyMutation,
} from "../../redux/services/api";
import { Avatar } from "react-native-paper";

import { selectApiSuccess } from "../../redux/slices/messageSlice";

const Index = () => {
  const router = useRouter();
  const scrollViewRef = useRef();
  const apiSuccess = useSelector(selectApiSuccess);
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [storedImage, setStoredImage] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userImage, setUserImage] = useState(null);
  const [iqBuddy] = useIqBuddyMutation();
  const { data } = useUserGetMeQuery();
  useEffect(() => {
    if (data?.data) {
      setUserImage(data?.data?.profileImageUrl);
    }
  }, [data]);
  const { data: messageData, refetch } =
    useGetMessageWithTotalTransactionQuery();
  useEffect(() => {
    // Wait for apiSuccess to be explicitly true or false
    if (apiSuccess === true && messageData.success === true) {
      setMotivationalMessage(messageData?.message || "");
      setTotalIncome(
        messageData?.data?.totalIncomeAndExpenses?.totalIncome || 0
      );
      setTotalExpenses(
        messageData?.data?.totalIncomeAndExpenses?.totalExpenses || 0
      );
    } else if (apiSuccess === false || apiSuccess === null) {
      // Only route when apiSuccess is confirmed false
      router.replace("Subscriptions");
    } else {
      router.replace("LoginScreen");
    }
  }, [apiSuccess, messageData]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const response = await iqBuddy({ message: messageToSend }).unwrap();
      const replyMessage = { text: response.result.message, sender: "bot" };

      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, there was an error. Please try again.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const customChartData = [
    { category: "Groceries", value: 333, color: "#7E49FF", icon: "food" },
    { category: "Car", value: 333, color: "#FF2D55", icon: "car" },
    { category: "Home", value: 333, color: "#1BA26E", icon: "home" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} />
        <Pressable onPress={() => router.push("AccountInformation")}>
          {userImage ? (
            <Avatar.Image size={48} source={{ uri: userImage }} />
          ) : (
            <Avatar.Image
              size={48}
              source={require("../../assets/images/avater.png")}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.tagLine}>
        <Text style={styles.text}>{motivationalMessage}</Text>
      </View>

      <View style={styles.chartsContainer}>
        <TotalSpentDonutChart
          data={customChartData}
          totalSpent={totalExpenses}
          changeAmount={totalIncome - totalExpenses}
          radius={150}
          strokeWidth={60}
        />
      </View>

      <TouchableOpacity
        style={styles.askButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.askButtonText}>ASK IQ BUDDY</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>IQ Buddy</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.chatContainer}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.messageBubble,
                    msg.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
              {isTyping && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <Text style={styles.messageText}>Bot is typing...</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Message IQ Buddy"
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={inputText.trim() === "" || isTyping}
                style={styles.sendButton}
              >
                {isTyping ? (
                  <ActivityIndicator size="small" color="#28a745" />
                ) : (
                  <Text
                    style={[
                      styles.sendIcon,
                      inputText.trim() === "" && { opacity: 0.3 },
                    ]}
                  >
                    ➤
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  chartsContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  tagLine: {
    backgroundColor: "#B8E2D2",
    padding: 10,
    alignItems: "center",
    marginTop: 25,
    borderRadius: 50,
  },
  text: { fontSize: 16, fontWeight: "bold" },
  askButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "30%",
    marginLeft: "60%",
  },
  askButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  popupContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  closeText: { fontSize: 18, color: "#fff" },
  chatContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexGrow: 0,
    height: 300,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
    marginBottom: 40,
  },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#28a745" },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#5C5C5C" },
  messageText: { color: "#fff" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: { justifyContent: "center", alignItems: "center", padding: 10 },
  sendIcon: { fontSize: 22, color: "#28a745" },
});
