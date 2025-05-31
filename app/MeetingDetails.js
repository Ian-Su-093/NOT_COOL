import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, Pressable } from "react-native"
import { fetchUserTask, fetchTaskGroup } from "@/firebaseAPI"
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage'

import styles from "./MeetingDetails.styles"

const MeetingDetails = ({ route, navigation }) => {
    const { meeting } = route.params
    const [meetingDetails, setMeetingDetails] = useState(meeting)
    const [tasks, setTasks] = useState([])
    const [taskGroup, setTaskGroup] = useState([])

    const fetchData = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID')
            const [TasksData, TaskGroupData] = await Promise.all([
                fetchUserTask(userID),
                fetchTaskGroup(userID)
            ])
            setTasks(TasksData)
            setTaskGroup(TaskGroupData)
        } catch (error) {
            console.error("Failed to fetch data: ", error)
        }
    }

    useEffect(() => {
        navigation.setOptions({ title: meetingDetails.MeetingName })
    }, [meetingDetails])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#F0EFF6" }}>
            <ScrollView contentContainerStyle={styles.mDetails}>
                <Pressable style={styles.mDetailsCancel} onPress={() => navigation.goBack()}>
                    <Text style={styles.mDetailsCancelText}>取消</Text>
                </Pressable>
                <Text style={styles.mDetailsHeader}>編輯會議</Text>
                <Text style={styles.mDetailsSectionName}>會議資訊</Text>
                <View style={styles.mDetailsSection}>
                    <TextInput
                        style={styles.mDetailsSectionInput}
                        placeholder={meetingDetails.MeetingName}
                        value={meetingDetails.MeetingName}
                        onChangeText={(text) => setMeetingDetails({ ...meetingDetails, MeetingName: text })}
                    />
                    <View style={styles.horizontalLine} />
                    <TextInput
                        style={[styles.mDetailsSectionInput, { height: 100, textAlignVertical: "top" }]}
                        placeholder={meetingDetails.MeetingDetail}
                        value={meetingDetails.MeetingDetail}
                        onChangeText={(text) => setMeetingDetails({ ...meetingDetails, MeetingDetail: text })}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <View style={styles.horizontalLine} />
                    <Text>
                        {meetingDetails.StartTime ? new Date(meetingDetails.StartTime).toLocaleString("zh-TW", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }).replace(/\//g, "/") : "無"}
                    </Text>
                    <View style={styles.horizontalLine} />
                    <View style={styles.mDetailsTime}>
                        {/* <Text>會議時長：{meetingDetails.Duration} 分鐘</Text> */}
                        <View style={styles.mDetailsTimeBtn}>
                            <Text>會議時長：</Text>
                            <TextInput
                                defaultValue={meetingDetails.Duration.toString()}
                                onEndEditing={
                                    (e) => {
                                        const value = parseInt(e.nativeEvent.text, 10)
                                        if (!isNaN(value) && value > 0) {
                                            setMeetingDetails({ ...meetingDetails, Duration: value })
                                        } else {
                                            setMeetingDetails({ ...meetingDetails })
                                        }
                                    }
                                }
                                keyboardType="numeric"
                            />
                            <Text> 分鐘</Text>
                        </View>
                        <View style={styles.mDetailsTimeBtn}>
                            <Pressable onPress={() => setMeetingDetails({ ...meetingDetails, Duration: meetingDetails.Duration > 1 ? meetingDetails.Duration - 1 : 1 })}>
                                <Text style={styles.mDetailsDecreaseBtn}> - </Text>
                            </Pressable>
                            <Pressable onPress={() => setMeetingDetails({ ...meetingDetails, Duration: meetingDetails.Duration + 1 })}>
                                <Text style={styles.mDetailsIncreaseBtn}> + </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <Text style={styles.mDetailsSectionName}>選擇專案</Text>
                <Text style={styles.mDetailsSectionName}>關聯任務 (選填)</Text>
                <View style={[styles.mDetailsSection]}>
                    <Text style={styles.mDetailsDropdownLabel}>選擇任務：</Text>
                    <Picker
                        selectedValue={meetingDetails.TaskID}
                        //WARNING: This should not change the TaskID of the meeting
                        // onValueChange={(itemValue) => setMeetingDetails({ ...meetingDetails, TaskID: itemValue })}
                        style={styles.mDetailsDropdown}
                    >
                        <Picker.Item label="無關聯任務" value={null} style={{ color: "#888" }} />
                        {tasks
                            .filter((task) => task.TaskID !== meetingDetails.TaskID)
                            .map((task) => (
                                <Picker.Item key={task.TaskID} label={task.TaskName} value={task.TaskID} style={{ color: "#888" }} />
                            ))}
                    </Picker>
                </View>
                <Pressable>
                    <Text style={styles.mDetailsSave}>更新會議</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default MeetingDetails