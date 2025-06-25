import { useNavigation } from 'expo-router'
import { Image, Pressable, StyleSheet, View } from 'react-native'

const BackButton = () => {
    const navigation = useNavigation()
  return (
    <View>
            <Pressable onPress={() => navigation.goBack()}>
                {
                    <Image
                        source={require('@/assets/images/backicon.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                }
            </Pressable>
        </View>
  )
}

export default BackButton

const styles = StyleSheet.create({
    image : {
        height : 40,
        width : 40
    }
})