import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './Dashboard.styles';

const backend_url = 'http://172.20.10.2:3000';

const Dashboard = ({ navigation }) => {
    const [leafTasks, setLeafTasks] = useState([]);
    const [finishedLeafTasks, setFinishedLeafTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

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

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllTasks();
        };
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                await fetchAllTasks();
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
                                <Text style={styles.topTaskTitle}>{leafTasks[0].TaskName}</Text>
                                <Text style={styles.topTaskDetail}>任務描述：{leafTasks[0].TaskDetail}</Text>
                                {
                                    leafTasks[0].Member &&
                                    <Text style={styles.memberBadge}>
                                        {
                                            leafTasks[0].Member.map((member, index) => (
                                                <Text key={index}>{member}</Text>
                                            ))
                                        }
                                    </Text>
                                }
                                <Text style={styles.taskInfo}>預計所需時間：{leafTasks[0].ExpectedTime / 60} 小時</Text>
                                <Text style={styles.taskInfo}>截止期限：{new Date(leafTasks[0].EndTime).toLocaleDateString()}</Text>
                            </View>
                        )
                    }
                    {
                        leafTasks && leafTasks.length > 0 ? (
                            leafTasks.map((task, index) => (
                                <>
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
                                            <Text style={styles.taskInfo}>{new Date(task.EndTime).toLocaleDateString()}</Text>
                                        </View>
                                    }
                                </>
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
                            <Text style={styles.modalTitle}>篩選設定</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Icon name="close" size={24} color="#333" />
                            </Pressable>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.filterOption}>排序方式</Text>
                            <Pressable style={styles.filterItem}>
                                <Text>依截止日期</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem}>
                                <Text>依重要性</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem}>
                                <Text>依預估時間</Text>
                            </Pressable>

                            <Text style={styles.filterOption}>顯示選項</Text>
                            <Pressable style={styles.filterItem}>
                                <Text>顯示已完成任務</Text>
                            </Pressable>
                            <Pressable style={styles.filterItem}>
                                <Text>只顯示今日任務</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default Dashboard;