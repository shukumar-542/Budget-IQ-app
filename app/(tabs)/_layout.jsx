import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const TabLayout = () => {
  return (
    <>
     <StatusBar/>
     <Stack>
        {/* <Stack.Screen name={InitialScreen} /> */}
     </Stack>
    </>
  )
}

export default TabLayout;