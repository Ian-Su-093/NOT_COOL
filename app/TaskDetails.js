import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { fetchUserTask } from "@/firebaseAPI";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./TaskDetails.styles";

const TaskDetail = ({ route, navigation }) => {
    const { taskID } = route.params;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userID, setUserID] = useState(null);

    const fetchTaskData = async () => {
        try {
            setLoading(true);
            const userID = await AsyncStorage.getItem('userID');
            setUserID(userID);

            const allTasks = await fetchUserTask(userID);
            const targetTask = allTasks.find(task => task.TaskID === taskID);

            if (targetTask) {
                setTask(targetTask);
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

                <Text style={styles.header}>任務詳情</Text>

                <View style={styles.taskCard}>
                    <Text style={styles.taskTitle}>{task.TaskName}</Text>

                    <View style={[styles.statusBadge, getStatusStyle()]}>
                        <Text style={styles.statusText}>{getTaskStatus()}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>任務描述</Text>
                        <Text style={styles.sectionContent}>
                            {task.TaskDetail || "無描述"}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>截止時間</Text>
                        <Text style={styles.sectionContent}>
                            {formatDate(task.EndTime)}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>建立時間</Text>
                        <Text style={styles.sectionContent}>
                            {formatDate(task.CreatedTime)}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>預計時間</Text>
                        <Text style={styles.sectionContent}>
                            {task.ExpectedTime || 0} 分鐘
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>懲罰值</Text>
                        <Text style={styles.sectionContent}>
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

                    <Text style={styles.taskId}>TaskID: {task.TaskID}</Text>

                    <Pressable style={styles.editButton}>
                        <Text style={styles.editButtonText}>編輯任務</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

export default TaskDetail;