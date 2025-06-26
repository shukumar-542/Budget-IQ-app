import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
    const router = useRouter()
  return (
     <View style={styles.container}>
         <Image
           source={require('../assets/images/trust.png')}
           style={styles.image}
           resizeMode="contain"
         />
   
         <Text style={styles.heading}>
           Your Trusted Financial Advisor — Always Within Reach
         </Text>
   
         <Text style={styles.description}>
           Connect instantly with savings experts — right from your phone.
         </Text>
   
         <TouchableOpacity style={styles.button} onPress={() => router.push("/SecondScreen")}>
           <Text style={styles.buttonText}>Next</Text>
         </TouchableOpacity>
   
         <View style={styles.pagination}>
           <View style={[styles.dot, styles.activeDot]} />
           <View style={styles.dot} />
         </View>
       </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1BA26E",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#00C46A',
  },
});
