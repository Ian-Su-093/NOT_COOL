import React, { useState, useEffect } from "react"
import { ScrollView, View, Text } from "react-native"
import { fetchUserMeeting, fetchUserTask } from "@/firebaseAPI";
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./Dashboard.styles"

const Dashboard = ({ navigation }) => {
    const [Tasks, setTasks] = useState([])
    const [Meetings, setMeetings] = useState([])

    // 從 Firestore 讀取資料
    const fetchData = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID');

            const [TasksData, MeetingData] = await Promise.all([
                fetchUserTask(userID),
                fetchUserMeeting(userID)
            ]);
            setTasks(TasksData);
            setMeetings(MeetingData);

            console.log("Data fetched successfully", TasksData);
        } catch (error) {
            console.error("Failed to fetch data: ", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView contentContainerStyle={styles.dashboard}>
                <Text style={styles.dashboardHeader}>儀表板</Text>
                <View style={styles.dashboardBlock}>
                    <Text style={styles.dashboardBlockHeader}>進度概要</Text>
                    {
                        Tasks.length > 0 ? (
                            Tasks.map((task, index) => (
                                <View key={index} style={styles.dashboardTaskPreview}>
                                    <Text style={styles.dashboardTaskPreviewTitle}>{task.TaskName}</Text>
                                    <Text style={styles.dashboardDate}>{task.EndTime ? new Date(task.EndTime).toLocaleString("zh-TW", {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(/\//g, "/") : "無"}</Text>
                                    <Text style={[styles.dashboardTaskPreviewProgress, { marginTop: "10" }]}>進度</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.dashboardNoTasksText}>目前無待辦事項</Text>
                        )
                    }
                </View>
                <View style={styles.dashboardBlock}>
                    <Text style={styles.dashboardBlockHeader}>今日任務</Text>
                    {
                        (() => {
                            const todayDate = new Date().toLocaleDateString("zh-TW", { year: 'numeric', month: 'long', day: 'numeric' });
                            const todayTasks = Tasks.filter(task => {
                                if (!task.EndTime) return false;
                                const taskDate = new Date(task.EndTime).toLocaleDateString("zh-TW", { year: 'numeric', month: 'long', day: 'numeric' });
                                return taskDate === todayDate;
                            });
                            return todayTasks.length > 0 ? (
                                todayTasks.map((task, index) => (
                                    <View key={index} style={styles.dashboardTaskPreview}>
                                        <Text style={styles.dashboardTaskPreviewTitle}>{task.TaskName}</Text>
                                        <Text style={styles.dashboardTaskPreviewProgress}>進度</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.dashboardNoTasksText}>今日無待辦事項</Text>
                            );
                        })()
                    }
                </View>
                <View style={styles.dashboardBlock}>
                    <Text style={styles.dashboardBlockHeader}>即將到來的會議</Text>
                    {
                        (() => {
                            const today = new Date();
                            const sevenDaysLater = new Date(today);
                            sevenDaysLater.setDate(today.getDate() + 7);
                            const upcomingMeetings = Meetings.filter(meeting => {
                                if (!meeting.StartTime) return false;
                                const meetingDate = new Date(meeting.StartTime);
                                return meetingDate >= today && meetingDate <= sevenDaysLater;
                            });
                            return upcomingMeetings.length > 0 ? (
                                upcomingMeetings.map((meeting, index) => (
                                    <View key={index} style={styles.dashboardMeetingPreview}>
                                        <View>
                                            <Text style={styles.dashboardTaskPreviewTitle}>{meeting.MeetingName}</Text>
                                            <Text style={styles.dashboardDate}>
                                                {meeting.StartTime ? new Date(meeting.StartTime).toLocaleString("zh-TW", {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                }).replace(/\//g, "/") : "無"}
                                            </Text>
                                        </View>
                                        <Text style={styles.dashboardMeetingDuration}>{meeting.Duration} min</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.dashboardNoTasksText}>近期無會議</Text>
                            );
                        })()
                    }
                </View>
            </ScrollView >
        </View>
    )
}

export default Dashboard