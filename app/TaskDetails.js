import React, { useState, useEffect, use } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, View, Text, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./TaskDetails.styles";
import Icon from 'react-native-vector-icons/MaterialIcons';

const backend_url = 'http://192.168.199.81:3000'   // For physical phone

const TaskDetails = ({ route, navigation }) => {
    const { taskID } = route.params;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userID, setUserID] = useState(null);
    const [childTaskNames, setChildTaskNames] = useState({});
    const [childTaskEndTimes, setChildTaskEndTimes] = useState({});

    const fetchTaskData = async () => {
        try {
            setLoading(true);
            const userID = await AsyncStorage.getItem('userID');
            setUserID(userID);

            const targetTask = await fetch(`${backend_url}/tasks/${taskID}`);

            if (targetTask) {
                setTask((await targetTask.json()).task);
            } else {
                setError("找不到該任務");
            }
        } catch (error) {
            console.error("Failed to fetch task: ", error);
            setError("載入任務失敗");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskData();
    }, [taskID]);

    useFocusEffect(
        React.useCallback(() => {
            fetchTaskData();
        }, [taskID])
    );

    useEffect(() => {
        if (task && task.Child && task.Child.length > 0) {
            fetchChildNamesEndTimes(task.Child);
        }
    }, [task]);

    const formatDate = (date) => {
        if (!date) return "無";
        return new Date(date).toLocaleString("zh-TW", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(/\//g, "/");
    };

    const getTaskStatus = () => {
        if (!userID || !task) return "未知";
        if (task.UnfinishedMember && task.UnfinishedMember.includes(userID)) {
            return "進行中";
        }
        return "已完成";
    };

    const getStatusStyle = () => {
        const status = getTaskStatus();
        return status === "已完成" ? styles.statusCompleted : styles.statusInProgress;
    };

    const getImportanceColor = () => {
        if (!task || task.Penalty === undefined) return "#000"; // Default color
        const importance = Math.min(Math.max(task.Penalty, 1), 10);
        // Assign importance from 1-10 to light green to bright yellow to bright red
        const hue = (10 - importance) * 120 / 10; // 120 is the hue for green, 0 for red
        return `hsl(${hue}, 100%, 50%)`; // HSL color format
    }

    const getPenaltyTextColor = () => {
        if (!task || task.Penalty === undefined) return "#000";
        if (task.Penalty <= 6) return "#000"; // Dark text for low importance
        return "#FFF"; // Slightly darker for medium importance
    }

    const fetchChildNamesEndTimes = async (childIDs) => {
        const names = {};
        for (const childId of childIDs) {
            try {
                const response = await fetch(`${backend_url}/tasks/${childId}`);
                const data = await response.json();
                names[childId] = data.task.TaskName || "無名稱";
                childTaskEndTimes[childId] = data.task.EndTime || "無截止時間";
            } catch (error) {
                console.error(`Failed to fetch child task ${childId}: `, error);
                names[childId] = "無名稱";
                childTaskEndTimes[childId] = "無截止時間";
            }
        }
        setChildTaskNames(names);
    };

    const setStatus = async (status) => {
        if (!userID || !task) return;
        if (status === "進行中") {
            try {
                const response = await fetch(`${backend_url}/tasks/${taskID}/unfinish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ UserID: userID, TaskID: taskID }),
                });
                if (!response.ok) throw new Error("Failed to start task");
                setTask(prev => ({ ...prev, UnfinishedMember: [...(prev.UnfinishedMember || []), userID] }));
                getStatusStyle();
            } catch (error) {
                console.error("Failed to update task status: ", error);
                setError("更新任務狀態失敗");
            }
        } else if (status === "已完成") {
            try {
                const response = await fetch(`${backend_url}/tasks/${taskID}/finish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ UserID: userID, TaskID: taskID }),
                });
                if (!response.ok) throw new Error("Failed to finish task");
                setTask(prev => ({ ...prev, UnfinishedMember: (prev.UnfinishedMember || []).filter(id => id !== userID) }));
                getStatusStyle();
            } catch (error) {
                console.error("Failed to update task status: ", error);
                setError("更新任務狀態失敗");
            }
        }
    }

    const isAvailable = async (taskID) => {
        const res = await fetch(`${backend_url}/tasks/${taskID}`);
        const data = (await res.json()).task;
        console.log("Task state:", data.State);
        console.log(data && data.State === "On");
        return (data && data.State === "On");
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.loadingText}>載入中...</Text>
                </View>
            </View>
        );
    }

    if (error || !task) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>← 返回</Text>
                    </Pressable>
                    <Text style={styles.errorText}>{error || "任務不存在"}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← 返回</Text>
                </Pressable>

                <View style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                        <Text style={styles.taskTitle}>{task.TaskName}</Text>
                        <Pressable onPress={() => setStatus(getTaskStatus() === "進行中" ? "已完成" : "進行中")}>
                            <View style={[styles.statusBadge, getStatusStyle()]}>
                                <Text style={styles.statusText}>{getTaskStatus()}</Text>
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>任務描述</Text>
                        <Text style={styles.sectionContent}>
                            {task.TaskDetail || "無描述"}
                        </Text>
                    </View>

                    <View style={styles.dateSection}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>建立時間</Text>
                            <Text style={styles.sectionContent}>
                                {formatDate(task.CreatedTime)}
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>截止時間</Text>
                            <Text style={styles.sectionContent}>
                                {formatDate(task.EndTime)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>預計所需時間</Text>
                        <Text style={styles.sectionContent}>
                            {task.ExpectedTime / 60 || 0} 分鐘
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>重要性</Text>
                        <Text style={[styles.sectionContent,
                        { backgroundColor: getImportanceColor(), borderRadius: 15, paddingVertical: 5, paddingHorizontal: 12, alignSelf: 'flex-start', color: getPenaltyTextColor() }]}>
                            {task.Penalty || 0}
                        </Text>
                    </View>

                    {task.Member && task.Member.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>成員 ({task.Member.length})</Text>
                            <View style={styles.membersList}>
                                {task.Member.map((member, index) => (
                                    <View key={index} style={styles.memberBadge}>
                                        <Text style={styles.memberText}>{member}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {task.Child && task.Child.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>任務細項 ({task.Child.length})</Text>
                            {task.Child.filter(
                                child => isAvailable(child)
                            ).map((child, index) => (
                                // Pressable buttons that directs to subtasks
                                <Pressable
                                    key={index}
                                    style={styles.subtaskButton}
                                    onPress={() => navigation.push('TaskDetails', { taskID: child })}
                                >
                                    <View>
                                        <Text style={styles.subtaskText}>{childTaskNames[child]}</Text>
                                        <Text style={styles.subtaskDate}>
                                            {childTaskEndTimes[child] ? `截止: ${formatDate(childTaskEndTimes[child])}` : "無截止時間"}
                                        </Text>
                                    </View>
                                    <Icon name="chevron-right" size={24} color="#aaa" style={{ alignSelf: "center", paddingLeft: 10 }} />
                                </Pressable>
                            ))}
                        </View>
                    )}

                    <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditTask', { taskID: task.TaskID })}>
                        <Text style={styles.editButtonText}>編輯任務</Text>
                    </Pressable>
                    <Pressable style={styles.addButton}>
                        <Text style={styles.addButtonText}>新增會議</Text>
                    </Pressable>
                    <Pressable style={styles.addButton} onPress={() => navigation.navigate('AddTask', { parentTaskID: task.TaskID })}>
                        <Text style={styles.addButtonText}>新增任務細項</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

export default TaskDetails;