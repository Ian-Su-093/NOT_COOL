import { registerRootComponent } from 'expo'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './app/Login'
import SignUp from './app/SignUp'
import Home from './app/Home'
import Dashboard from './app/Dashboard'
import Tasks from './app/Tasks'
import TaskDetails from './app/TaskDetails'
import AddTask from './app/AddTask'
import EditTask from './app/EditTask'
import Meetings from './app/Meetings'
import MeetingDetails from './app/MeetingDetails'
import AddMeeting from './app/AddMeeting'
import EditMeeting from './app/EditMeeting'
import Settings from './app/Settings'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const MainTabs = () => (
    <Tab.Navigator initialRouteName="儀表板" screenOptions={{ headerShown: false }}>
        <Tab.Screen name="儀表板" component={DashboardStack} />
        <Tab.Screen name="任務" component={TasksStack} />
        <Tab.Screen name="會議" component={MeetingsStack} />
    </Tab.Navigator>
)

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
        <Stack.Screen name="MeetingDetails" component={MeetingDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
)

const TasksStack = () => (
    <Stack.Navigator initialRouteName="Tasks">
        <Stack.Screen name="Tasks" component={Tasks} options={{ headerShown: false }} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
)

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="AddTask" component={AddTask} options={{ headerShown: true, title: '新增任務' }} />
                <Stack.Screen name="EditTask" component={EditTask} options={{ headerShown: true, title: '編輯任務' }} />
                <Stack.Screen name="AddMeeting" component={AddMeeting} options={{ headerShown: true, title: '新增會議' }} />
                <Stack.Screen name="EditMeeting" component={EditMeeting} options={{ headerShown: true, title: '編輯會議' }} />
                <Stack.Screen name="Settings" component={Settings} options={{ headerShown: true, title: '設定' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

registerRootComponent(App)

export default App