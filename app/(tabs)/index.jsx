import { Image, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/iq.png";
import { Colors } from "../../Constants/Colors";

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={logo} />
        </View>
        <Avatar.Icon icon="account" size={40} style={{ backgroundColor: Colors.primary }} />
      </View>
      <View style={styles.tagLine}>
        <Text style={styles.text}>“Skipping one coffee = $5 closer to your goal”</Text>
      </View>
      {/* <View>
        <DonutChart/>
      </View> */}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header : {
    flexDirection :'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },
  tagLine:{
    backgroundColor : "#B8E2D2",
    padding : 10,
    alignItems : "center",
    marginTop : 15,
    borderRadius : 50
  },
  text : {
    fontSize : 16,
    fontWeight : 'bold'
  }
});
