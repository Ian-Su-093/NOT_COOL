import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import { fetchUserTask } from "@/firebaseAPI";
import styles from "./Tasks.styles"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';

const backend_url =
    Platform.OS === 'web'
        ? 'http://localhost:3000'       // For browser or Expo web
        : 'http://192.168.1.15:3000';   // For physical phone

const Tasks = ({ navigation }) => {
    const [Tasks, setTasks] = useState([])
    const [SortedBy, setSortedBy] = useState("deadline") // "deadline" or "expectedTime"

    const getRootTasks = async () => {
        // try {
        //     const userID = "MI51nEam3GgPqbV7WQeP";

        //     const [TasksData, MeetingData] = await Promise.all([
        //         fetchUserTask(userID),
        //     ]);
        //     setTasks(TasksData);

        //     console.log("Data fetched successfully", TasksData);
        // } catch (error) {
        //     console.error("Failed to fetch data: ", error);
        // }
        const userID = "MI51nEam3GgPqbV7WQeP";
        console.log("Fetching tasks for user:", userID);
        const res = await fetch(`${backend_url}/users/${userID}/tasks/root`);
        setTasks(await res.json());
    }

    useEffect(() => {
        getRootTasks()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#F0EFF6" }}>
            <ScrollView contentContainerStyle={styles.tasks}>
                <View style={styles.panel}>
                    <Pressable style={styles.button} onPress={() => setSortedBy("deadline")}>
                        <Text style={styles.buttonText}>依截止日期</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => setSortedBy("expectedTime")}>
                        <Text style={styles.buttonText}>依所需時間</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => getRootTasks()}>
                        <Text style={styles.buttonText}>切換已完成</Text>
                    </Pressable>
                </View>
                <View style={styles.tasksTaskList}>
                    {
                        Tasks.length > 0 ? (
                            Tasks.sort((a, b) => {
                                if (SortedBy === "deadline") {
                                    return new Date(a.EndTime) - new Date(b.EndTime);
                                } else if (SortedBy === "expectedTime") {
                                    return a.ExpectedTime - b.ExpectedTime;
                                }
                                return 0;
                            }).map((task, index) => (
                                <View key={index} style={styles.tasksTaskPreview}>
                                    <View>
                                        <Text style={styles.tasksTaskPreviewTitle}>{task.TaskName}</Text>
                                        <Text style={styles.tasksDate}>{task.EndTime ? new Date(task.EndTime).toLocaleString("zh-TW", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        }).replace(/\//g, "/") : "無"}</Text>
                                    </View>
                                    <Icon name="chevron-right" size={30} color="#aaa" style={{ alignSelf: "center", paddingLeft: 10 }} />
                                </View>
                            ))
                        ) : (
                            <Text style={styles.tasksNoTasksText}>目前無待辦事項</Text>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default Tasks