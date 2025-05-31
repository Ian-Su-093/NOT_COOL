import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import styles from "./Tasks.styles"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backend_url =
    Platform.OS === 'web'
        ? 'http://192.168.199.81:3000'       // For browser or Expo web
        : 'http://192.168.199.81:3000';   // For physical phone

const Tasks = ({ navigation }) => {
    const [rootTasks, setRootTasks] = useState([])
    const [leafTasks, setLeafTasks] = useState([])
    const [sortedBy, setSortedBy] = useState("deadline")
    const [showCompleted, setShowCompleted] = useState(false)
    const [showRootTasks, setShowRootTasks] = useState(true)
    const [userID, setUserID] = useState(null);

    const getRootTasks = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const res = await fetch(`${backend_url}/users/${userID}/tasks/root`);
        setRootTasks((await res.json()).tasks);
    }

    const getLeafTasks = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const res = await fetch(`${backend_url}/users/${userID}/tasks/leaf`);
        setLeafTasks((await res.json()).tasks);
    }

    useEffect(() => {
        getRootTasks()
        getLeafTasks()
        AsyncStorage.getItem('userID').then(value => {
            setUserID(value);
        });
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#F0EFF6" }}>
            <ScrollView contentContainerStyle={styles.tasks}>
                <View style={styles.panel}>
                    <Pressable style={styles.button} onPress={() => sortedBy === "deadline" ? setSortedBy("expectedTime") : setSortedBy("deadline")}>
                        {sortedBy === "deadline" ? <Text style={styles.buttonText}><Icon name="sort" /> 依截止日期</Text> : <Text style={styles.buttonText}><Icon name="sort" /> 依所需時間</Text>}
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => setShowCompleted(!showCompleted)}>
                        {showCompleted === true ? <Text style={styles.buttonText}>已完成</Text> : <Text style={styles.buttonText}>未完成</Text>}
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => setShowRootTasks(!showRootTasks)}>
                        {showRootTasks === true ? <Text style={styles.buttonText}>主要任務</Text> : <Text style={styles.buttonText}>任務細項</Text>}
                    </Pressable>
                </View>
                <View style={styles.tasksTaskList}>
                    {
                        (() => {
                            const currentTasks = showRootTasks ? rootTasks : leafTasks;
                            const filteredTasks = currentTasks.filter((task) => {
                                if (!showCompleted) {
                                    return task.UnfinishedMember.includes(userID);
                                } else {
                                    return !task.UnfinishedMember.includes(userID);
                                }
                            });

                            return filteredTasks.length > 0 ? (
                                filteredTasks.sort((a, b) => {
                                    if (sortedBy === "deadline") {
                                        return new Date(a.EndTime) - new Date(b.EndTime);
                                    } else if (sortedBy === "expectedTime") {
                                        return a.ExpectedTime - b.ExpectedTime;
                                    }
                                    return 0;
                                }).map((task, index) => (
                                    <Pressable key={index} style={styles.tasksTaskPreview} onPress={() => navigation.navigate("TaskDetails", { taskID: task.TaskID })}>
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
                                    </Pressable>
                                ))
                            ) : (
                                <Text style={styles.tasksNoTasksText}>目前無{showCompleted ? "已完成" : "代辦"}事項</Text>
                            );
                        })()
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default Tasks