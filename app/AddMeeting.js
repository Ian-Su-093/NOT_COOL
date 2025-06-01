import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, Pressable } from "react-native"
import { fetchUserTask, fetchTaskGroup } from "@/firebaseAPI"
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage'

import styles from "./MeetingDetails.styles"

const backend_url = 'http://192.168.199.81:3000';

const AddMeeting = ({ route, navigation }) => {
    const { taskID } = route.params || {}
}

export default AddMeeting;