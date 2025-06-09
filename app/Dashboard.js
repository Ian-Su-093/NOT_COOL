import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalIP } from "./util/helpers";
import styles from './Dashboard.styles';

const backend_url = `http://${getLocalIP()}:3000`;

const Dashboard = ({ navigation }) => {
    const [leafTasks, setLeafTasks] = useState([]);
    const [finishedLeafTasks, setFinishedLeafTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [arrangeBy, setArrangeBy] = useState(-1);

    const getLeafTasks = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const res = await fetch(`${backend_url}/users/${userID}/tasks/leaf`);
        setLeafTasks((await res.json()).tasks);
    }

    const getFinishedLeafTasks = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const res = await fetch(`${backend_url}/users/${userID}/tasks/finished-leaf`);
        setFinishedLeafTasks((await res.json()).tasks);
    }

    const fetchAllTasks = async () => {
        try {
            await Promise.all([
                getLeafTasks(),
                getFinishedLeafTasks()
            ]);
        } catch (error) {
            console.error("Failed to fetch tasks: ", error);
        }
    }

    const fetchArrangeBy = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID');
            const res = await fetch(`${backend_url}/users/${userID}/arrange`);
            if (!res.ok) {
                throw new Error('Failed to fetch arrange by');
            }
            const data = await res.json();
            setArrangeBy(data.arrange);
            console.log("Fetched arrange by: ", data.arrange);
        } catch (error) {
            console.error("Failed to fetch arrange by: ", error);
        }
    }

    const convertFirestoreTimestamp = (timestamp) => {
        if (!timestamp) return null;

        // 如果已經是 Date 對象
        if (timestamp instanceof Date) return timestamp;

        // 如果是 ISO 字符串
        if (typeof timestamp === 'string') return new Date(timestamp);

        // 如果是 Firestore Timestamp 對象
        if (timestamp.seconds !== undefined) {
            return new Date(timestamp.seconds * 1000);
        }

        return null; // 如果都不是，返回 null
    };

    const handleArrangeByChange = async (value) => {
        // setArrangeBy(value);
        if (value === -1) {
            return;
        }
        console.log("Arrange by changed to: ", value);
        try {
            const userID = await AsyncStorage.getItem('userID');
            const res = await fetch(`${backend_url}/users/${userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Arrange: value })
            });
            if (!res.ok) {
                throw new Error('Failed to update arrange by');
            } else {
                console.log("Arrange by updated successfully");
            }
        } catch (error) {
            console.error("Failed to update arrange by: ", error);
            return;
        }
        setShowModal(false);

        try {
            const userID = await AsyncStorage.getItem('userID');
            const res = await fetch(`${backend_url}/users/${userID}/schedule/?alg=${arrangeBy}`);
            const data = (await res.json()).result;
            console.log("Fetched updated tasks: ", data);
            setLeafTasks([]);
            for (const taskID of data) {
                console.log("Fetching task with ID: ", taskID);
                const taskRes = await fetch(`${backend_url}/tasks/${taskID}`);
                const taskData = await taskRes.json();
                console.log("Fetched task data: ", taskData);
                setLeafTasks(prevTasks => [...prevTasks, taskData.task]);
            }
            console.log("Updated tasks fetched successfully");
        } catch (error) {
            console.error("Failed to fetch updated tasks: ", error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            // await fetchAllTasks();
            await getFinishedLeafTasks();
            await fetchArrangeBy();
        };
        fetchData();
    }, []);

    useEffect(() => {
        const refresh = async () => {
            await handleArrangeByChange(arrangeBy);
        }
        refresh();
    }, [arrangeBy]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                await fetchAllTasks();
                await fetchArrangeBy();
            };
            fetchData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headBar}>
                    <Pressable onPress={() => setShowModal(true)}>
                        <Icon name="tune" size={24} />
                    </Pressable>
                    <Text style={styles.title}>儀表板</Text>
                    <Pressable onPress={() => navigation.navigate('Settings')}>
                        <Icon name="settings" size={24} />
                    </Pressable>
                </View>
                <View style={styles.taskContent}>
                    <Text style={styles.title}>進行中任務</Text>
                    {
                        leafTasks && leafTasks.length > 0 && (
                            <View style={styles.topTask}>
                                <View style={styles.topTaskHeader}>
                                    <View style={styles.topTaskLeftColumn}>
                                        <Text style={styles.topTaskTitle}>{leafTasks[0].TaskName}</Text>
                                        <Text style={styles.taskInfo}>預計所需時間：</Text>
                                        <Text style={styles.taskInfo}>{leafTasks[0].ExpectedTime / 60} 分鐘</Text>
                                        <Text style={styles.taskInfo}>截止期限：</Text>
                                        <Text style={styles.taskInfo}>{convertFirestoreTimestamp(leafTasks[0].EndTime).toLocaleDateString("zh-TW", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        }).replace(/\//g, "/")}</Text>
                                    </View>
                                    <View style={styles.topTaskRightColumn}>
                                        <Text style={styles.topTaskDetail}>{leafTasks[0].TaskDetail}</Text>
                                    </View>
                                </View>
                                {
                                    leafTasks[0].Member &&
                                    leafTasks[0].Member.map((member, index) => (
                                        <Text key={index} style={styles.memberBadge}>
                                            <Text>{member}</Text>
                                        </Text>
                                    ))
                                }
                            </View>
                        )
                    }
                    {
                        leafTasks && leafTasks.length > 0 ? (
                            leafTasks.map((task, index) => (
                                <View key={index}>
                                    {
                                        index > 0 &&
                                        <View
                                            key={index}
                                            style={[
                                                styles.ongoingTask,
                                                { backgroundColor: index % 2 === 0 ? '#8B0000' : '#000' }
                                            ]}
                                        >
                                            <Text style={styles.taskInfo}>{task.TaskName}</Text>
                                            <Text style={styles.taskInfo}>{convertFirestoreTimestamp(task.EndTime).toLocaleDateString("zh-TW", {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }).replace(/\//g, "/")}</Text>
                                        </View>
                                    }
                                </View>
                            ))
                        ) : (
                            <Text style={styles.tasksNoTasksText}>沒有進行中的任務</Text>
                        )
                    }
                    <View style={{ height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 }} />
                    <Text style={styles.title}>已完成任務</Text>
                    <View style={styles.taskGrid}>
                        {
                            finishedLeafTasks && finishedLeafTasks.length > 0 ? (
                                finishedLeafTasks.map((task, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.finishedTask,
                                            { backgroundColor: (index + 1) % 4 >= 2 ? '#000' : '#8B0000' }
                                        ]}
                                    >
                                        <Text style={styles.taskInfo}>{task.TaskName}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.tasksNoTasksText}>沒有已完成的任務</Text>
                            )
                        }
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>設定</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Icon name="close" size={24} color="#333" />
                            </Pressable>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.filterOption}>排序方式</Text>
                            <Pressable style={styles.filterItem} onPress={() => setArrangeBy(1)}>
                                <Text>Judging</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem} onPress={() => setArrangeBy(2)}>
                                <Text>Prospecting</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem} onPress={() => setArrangeBy(3)}>
                                <Text>依截止日期</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem} onPress={() => setArrangeBy(4)}>
                                <Text>依重要性</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem} onPress={() => setArrangeBy(5)}>
                                <Text>依最短所需時間</Text>
                            </Pressable>

                            <Text style={styles.filterOption}>主題</Text>
                            <Pressable style={styles.filterItem}>
                                <Text>紅黑</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem}>
                                <Text>綠黃</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem}>
                                <Text>藍橘</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default Dashboard;