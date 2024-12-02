import { Alert } from 'react-native'
import { useState, useEffect } from 'react'
import LittleLemonHeader from './LittleLemonHeader'
import Onboarding from './screens/Onboarding'
import Profile from './screens/Profile'
import SplashScreen from './screens/SplashScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage  from '@react-native-async-storage/async-storage'

export default function App() {
  const [ loggedIn, setLoggedIn ] = useState(null)
  
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('onboarded');
        setLoggedIn(value ? JSON.parse(value) : false);
      } catch (e) {
        Alert.alert('Error', `Failed to load onboarded status: ${e}`);
        setLoggedIn(false);
      }
    })();
  }, []); // Empty dependency array ensures this runs only once

  const Stack = createNativeStackNavigator()

  if(loggedIn === null){
    return <SplashScreen />;
  }
  return (
    <>
    <LittleLemonHeader />
    <NavigationContainer style={{flex: 1}}>
      <Stack.Navigator>
      {loggedIn ? (
            <Stack.Screen options={{headerShown: false}} name="Profile" component={Profile} />
          ) : (
            <Stack.Screen options={{headerShown: false }} name="Onboarding" component={Onboarding} />
      )}
      </Stack.Navigator>
    </NavigationContainer>
    </>
  )
}
