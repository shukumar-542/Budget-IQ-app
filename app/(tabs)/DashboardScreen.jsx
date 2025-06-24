import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/iq.png";
import ExpenseIncome from "../../components/Charts/ExpenseIncome";
const DashboardScreen = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("month");
  const [items, setItems] = useState([
    { label: "This Month", value: "month" },
    { label: "This Week", value: "week" },
    { label: "This Year", value: "year" },
  ]);


const expenseData = [
  { id: '1', name: 'Home', icon: 'home', amount: '$500' },
  { id: '2', name: 'Groceries', icon: 'fast-food', amount: '$450' },
  { id: '3', name: 'Car', icon: 'car', amount: '$350' },
  { id: '4', name: 'Leisure', icon: 'flower-outline', amount: '$00' }, 
  { id: '5', name: 'Health', icon: 'videocam', amount: '$00' },
  { id: '6', name: 'Entertainment', icon: 'medkit', amount: '$00' }, 
  { id: '7', name: 'Education', icon: 'school', amount: '$00' }, 
  { id: '8', name: 'Gifts', icon: 'gift', amount: '$00' },
  { id: '9', name: 'Shopping', icon: 'cart', amount: '$00' },
  { id: '10', name: 'Travel', icon: 'airplane', amount: '$00' },
];

  return (
    <SafeAreaView style={styles.container}>
      {/* Dropdown container  */}
      <View style={styles.header}>
        <View>
          <Image source={logo} />
        </View>
        <View style={styles.dropdownContainers}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select Time Range"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
          />
        </View>
      </View>

      <ExpenseIncome expenseData={expenseData}  />


    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff",
    padding: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownContainers: {
    margin: 10,
    zIndex: 1000,
    width: 150,
  },
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownBox: {
    borderColor: "#ccc",
  },
});
