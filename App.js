import { registerRootComponent } from 'expo'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from './app/Home'
import Dashboard from './app/Dashboard'
import Meetings from './app/Meetings'
import MeetingDetails from './app/MeetingDetails'
import Tasks from './app/Tasks'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const HomeStack = () => (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
)

const DashboardStack = () => (
    <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
    </Stack.Navigator>
)

const MeetingsStack = () => (
    <Stack.Navigator initialRouteName="Meetings">
        <Stack.Screen name="Meetings" component={Meetings} options={{ headerShown: false }} />
        {/* <Stack.Screen name="MeetingDetails" component={MeetingDetails} options={{ headerTitle: "會議", headerStyle: { backgroundColor: "#F0EFF6" }, headerShadowVisible: false }} /> */}
        <Stack.Screen name="MeetingDetails" component={MeetingDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
)

const TasksStack = () => (
    <Stack.Navigator initialRouteName="Tasks">
        <Stack.Screen name="Tasks" component={Tasks} options={{ headerShown: false }} />
    </Stack.Navigator>
)

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="儀表板" screenOptions={{ headerShown: false }}>
                <Tab.Screen name="首頁" component={HomeStack} />
                <Tab.Screen name="儀表板" component={DashboardStack} />
                <Tab.Screen name="會議" component={MeetingsStack} />
                <Tab.Screen name="任務" component={TasksStack} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

registerRootComponent(App)

export default App