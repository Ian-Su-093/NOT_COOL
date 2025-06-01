import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './AddTask.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const backend_url =
    Platform.OS === 'web'
        ? 'http://192.168.199.81:3000'
        : 'http://192.168.199.81:3000';

const AddTask = ({ route, navigation }) => {
    const { parentTaskID } = route.params || {};
    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
    const [endTime, setEndTime] = useState(new Date());
    const [expectedTime, setExpectedTime] = useState('');
    const [penalty, setPenalty] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [parentPenalty, setParentPenalty] = useState(-1);

    const handleSubmit = async () => {
        if (!taskName || !taskDetail || !endTime || !expectedTime || !penalty || penalty < 1 || penalty > 10) {
            alert('請填寫所有欄位！');
            return;
        }
        if (parentPenalty !== -1 && parseInt(penalty) !== parentPenalty) {
            alert(`重要性必須與父任務 (${parentPenalty}) 相同！`);
            return;
        }
        setIsLoading(true);

        try {
            const userID = await AsyncStorage.getItem('userID');
            if (!userID) {
                alert('錯誤', '未找到用戶ID，請先登入。');
                setIsLoading(false);
                return;
            }

            const taskData = {
                UserID: userID,
                TaskName: taskName,
                TaskDetail: taskDetail,
                EndTime: endTime.toISOString(),
                ExpectedTime: parseInt(expectedTime) * 60,
                Penalty: parseInt(penalty),
                Member: [userID],
                Parent: parentTaskID || null,
            };

            console.log('提交的任務數據:', taskData);

            const response = await fetch(`${backend_url}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const data = await response.json();

                setTaskName('');
                setTaskDetail('');
                setEndTime(new Date());
                setExpectedTime('');
                setPenalty('');
                setShowPicker(false);
                setIsLoading(false);

                alert('成功', '任務已新增！', [
                    {
                        text: '確定',
                        onPress: () => navigation.navigate('Tasks', {
                            refresh: true,
                        }),
                    }
                ]);
            } else {
                const errorData = await response.json();
                alert('錯誤', `新增任務失敗: ${errorData.message}`);
                console.error('新增任務失敗:', errorData);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('新增任務時發生錯誤:', error);
            alert('錯誤', '新增任務時發生錯誤，請稍後再試。');
            setIsLoading(false);
        }
    };

    const getParentPenalty = async () => {
        if (!parentTaskID) return;

        try {
            const response = await fetch(`${backend_url}/tasks/${parentTaskID}`);
            if (response.ok) {
                const parentTask = await response.json();
                setParentPenalty(parentTask.task.Penalty);
            } else {
                console.error('獲取父任務失敗:', response.statusText);
            }
        } catch (error) {
            console.error('獲取父任務時發生錯誤:', error);
        }
    }

    useEffect(() => {
        getParentPenalty();
    }, [parentTaskID]);

    return (
        <View style={styles.container}>
            <View style={styles.infoBox}>
                <TextInput
                    style={styles.input}
                    placeholder="任務名稱"
                    value={taskName}
                    onChangeText={setTaskName}
                />
                <TextInput
                    style={styles.inputArea}
                    placeholder="任務描述"
                    value={taskDetail}
                    onChangeText={setTaskDetail}
                />
                <Pressable style={styles.button} onPress={() => setShowPicker(true)}>
                    <View><Text style={styles.buttonText}>選擇截止時間</Text></View>
                </Pressable>
                {showPicker && (
                    <DateTimePicker
                        value={endTime}
                        mode="datetime"
                        display="default"
                        onChange={(event, date) => {
                            setShowPicker(false);
                            if (date) {
                                setEndTime(date);
                            }
                        }}
                    />
                )}
                <Text style={[styles.input, { marginTop: 10 }]}>截止時間：{endTime.toLocaleString()}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="預計所需時間（分鐘）"
                    value={expectedTime}
                    keyboardType="numeric"
                    onChangeText={setExpectedTime}
                />
                <TextInput
                    style={styles.lastInput}
                    placeholder="重要性 (1-10)"
                    value={penalty}
                    keyboardType="numeric"
                    onChangeText={setPenalty}
                />
            </View>
            <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSubmit} disabled={isLoading}>
                <View><Text style={styles.buttonText}>新增</Text></View>
            </Pressable>
        </View>
    );
}

export default AddTask;