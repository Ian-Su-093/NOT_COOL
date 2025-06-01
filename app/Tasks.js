import React, { useState, useEffect } from "react"
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, View, Text, Pressable } from "react-native"
import styles from "./Tasks.styles"
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backend_url = 'http://172.20.10.2:3000'   // For physical phone

const Tasks = ({ navigation }) => {
    const [rootTasks, setRootTasks] = useState([])
    const [leafTasks, setLeafTasks] = useState([])
    const [finishedRootTasks, setFinishedRootTasks] = useState([])
    const [finishedLeafTasks, setFinishedLeafTasks] = useState([])
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

    const getFinishedRootTasks = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const res = await fetch(`${backend_url}/users/${userID}/tasks/finished-root`);
        setFinishedRootTasks((await res.json()).tasks);
    }

    const getFinishedLeafTasks = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const res = await fetch(`${backend_url}/users/${userID}/tasks/finished-leaf`);
        setFinishedLeafTasks((await res.json()).tasks);
    }

    const fetchAllTasks = async () => {
        try {
            await Promise.all([
                getRootTasks(),
                getLeafTasks(),
                getFinishedRootTasks(),
                getFinishedLeafTasks()
            ]);

            const userID = await AsyncStorage.getItem('userID');
            setUserID(userID);
        } catch (error) {
            console.error("Failed to fetch tasks: ", error);
        }
    }

    useEffect(() => {
        fetchAllTasks();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchAllTasks();
        }, [])
    );

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
                            currentTasks = [];
                            if (showRootTasks && showCompleted) {
                                currentTasks = finishedRootTasks;
                            } else if (showRootTasks && !showCompleted) {
                                currentTasks = rootTasks;
                            } else if (!showRootTasks && showCompleted) {
                                currentTasks = finishedLeafTasks;
                            } else {
                                currentTasks = leafTasks;
                            }
                            currentTasks = currentTasks || [];

                            return currentTasks.length > 0 ? (
                                currentTasks.sort((a, b) => {
                                    if (sortedBy === "deadline") {
                                        if (a.EndTime === b.EndTime) {
                                            return new Date(a.ExpectedTime) - new Date(b.ExpectedTime);
                                        }
                                        return new Date(a.EndTime) - new Date(b.EndTime);
                                    } else if (sortedBy === "expectedTime") {
                                        if (a.ExpectedTime === b.ExpectedTime) {
                                            return new Date(a.EndTime) - new Date(b.EndTime);
                                        }
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
                    {
                        !showCompleted && showRootTasks && (
                            <Pressable style={styles.tasksAddTaskButton} onPress={() => navigation.navigate("AddTask")}>
                                <Text style={styles.tasksAddTaskButtonText}>新增任務</Text>
                            </Pressable>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default Tasks