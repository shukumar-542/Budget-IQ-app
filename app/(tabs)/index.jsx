import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/iq.png";
import TotalSpentDonutChart from "../../components/Charts/TotalSpentDonutChart";
import { Colors } from "../../Constants/Colors";
import { Modal, TextInput } from "react-native";
import { useState } from "react";
import { useRef } from "react";
import { ScrollView } from "react-native";
import { useIqBuddyMutation } from "../../redux/services/api";
const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef();
  const router = useRouter();
  const [iqBuddy] = useIqBuddyMutation();
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    const userMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText(""); // Clear input field

    try {
      // 1. Show typing indicator
      setIsTyping(true);

      // 2. Simulate typing delay
      setTimeout(async () => {
        // 3. Get the bot's response
        const response = await iqBuddy({ message: inputText }).unwrap();
        console.log("Bot response:", response);

        const replyMessage = { text: response.result.message, sender: "bot" };

        // 4. Add bot message and hide typing
        setIsTyping(false);
        setMessages((prev) => [...prev, replyMessage]);
      }, 1500); // 1.5 seconds typing delay, adjust as needed
    } catch (error) {
      console.error("Error getting bot response:", error);
      setIsTyping(false);
      const errorMessage = {
        text: "Sorry, there was an error. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const customChartData = [
    { category: "Groceries", value: 333, color: "#7E49FF", icon: "food" }, // Different green
    { category: "Car", value: 333, color: "#FF2D55", icon: "car" }, // Different purple
    { category: "Home", value: 333, color: "#1BA26E", icon: "home" }, // Different red
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} />

        <Pressable onPress={() => router.push("AccountInformation")}>
          <Avatar.Icon
            icon="account"
            size={40}
            style={{ backgroundColor: Colors.primary }}
          />
        </Pressable>
      </View>

      <View style={styles.tagLine}>
        <Text style={styles.text}>
          “Skipping one coffee = $5 closer to your goal”
        </Text>
      </View>

      <View style={styles.chartsContainer}>
        <TotalSpentDonutChart
          data={customChartData}
          totalSpent={1300}
          changeAmount={2000}
          radius={150}
          strokeWidth={60}
        />
      </View>
      {/* Ask Button */}
      <TouchableOpacity
        style={styles.askButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.askButtonText}>ASK IQ BUDDY</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>IQ Buddy</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Chat Content */}
            <ScrollView
              style={styles.chatContainer}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((msg, index) => (
                <View
                  key={index}
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
              {/* ✅ Add typing indicator here */}
              {isTyping && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <Text style={styles.messageText}>Bot is typing...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Message IQ Buddy"
                style={styles.input}
                value={inputText}
                onChangeText={(text) => {
                  if (text.trim() !== "") {
                    setInputText(text);
                  } else {
                    setInputText(""); // optional: allow clearing the field completely
                  }
                }}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={inputText.trim() === "" || isTyping}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                }}
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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  chartsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagLine: {
    backgroundColor: "#B8E2D2",
    padding: 10,
    alignItems: "center",
    marginTop: 25,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  askButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "30%",
    marginLeft: "60%",
  },
  askButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Modal styles
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  closeText: {
    fontSize: 18,
    color: "#fff",
  },
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
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#28a745",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#5C5C5C",
  },
  messageText: {
    color: "#fff",
  },
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
  sendIcon: {
    fontSize: 22,
    color: "#28a745",
  },
});
