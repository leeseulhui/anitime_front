// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './Main';
import PetProfile from './PetProfile';
import UserProfile from './UserProfile';
import Complete from './Complete'
import Complete_inquiry from './Complete_inquiry'
import NewScreen from './NewScreen'
import NewScreen_inquiry from './NewScreen_inquiry'


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="뒤로가기" component={MainScreen} options={{
          headerShown: false
        }}/>
        <Stack.Screen name="반려견 설정" component={PetProfile} />
        <Stack.Screen name="유저 프로필설정" component={UserProfile}/>
        <Stack.Screen name="Complete" component={Complete} options={{
          headerShown: false
        }}/>
        <Stack.Screen name="NewScreen" component={NewScreen} options={{
          headerShown: false
        }}/>
        <Stack.Screen name="Complete_inquiry" component={Complete_inquiry} options={{
          headerShown: false
        }}/>
        <Stack.Screen name="NewScreen_inquiry" component={NewScreen_inquiry} options={{
          headerShown: false
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
