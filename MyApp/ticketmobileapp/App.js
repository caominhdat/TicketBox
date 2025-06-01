import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Home  from './components/Home/Home';
import React, { useContext, useReducer } from 'react';
import Login from './components/User/Login';
import Event from './components/Event/Event';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './styles/Colors';
import MyTicket from './components/MyTickets/MyTicket';
import MyContext from './configs/MyContext';
import MyUserReducers from './reducers/MyUserReducer';
import User from './components/User/User';
import Register from './components/User/Register';
import BookTicket from './components/MyTickets/BookTicket';
import Pay from './components/Payment/Pay';

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabNavigator() {
  const [user] = React.useContext(MyContext);

  return (
    <BottomTab.Navigator initialRouteName="Trang chủ" screenOptions={{headerShown: false, tabBarActiveTintColor: colors.primaryGreen, tabBarActiveBackgroundColor: '#1a1a1a'}}>
      <BottomTab.Screen name="Trang chủ" component={Home} />
      <BottomTab.Screen name="Vé của tôi" component={MyTicket} />
      <BottomTab.Screen name="Tài khoản" component={user ? User : Login} options={{ title: user ? `${user.username}` : 'Tài khoản' }}/>
    </BottomTab.Navigator>
  );
}

export default function App(){
  const [user, dispatch] = useReducer(MyUserReducers, null)
  return (
    <MyContext.Provider value={[user, dispatch ]}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: colors.primaryGreen}, headerTintColor: 'black'}}>
        <Stack.Screen name="Back" component={BottomTabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Event" component={Event} options={{ title: 'Chi tiết sự kiện'}} />
        <Stack.Screen name="Account" component={User} options={{ title: 'Tài khoản'}} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Đăng kí'}} />
        <Stack.Screen name="BookTicket" component={BookTicket} options={{ title: 'Đặt vé'}} />
        <Stack.Screen name="Pay" component={Pay} options={{ title: 'Thanh toán'}} />
      </Stack.Navigator>

    </NavigationContainer>
    </MyContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
