import React, { use, useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './EditTask.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalIP } from "./util/helpers";
const backend_url = `http://${getLocalIP()}:3000`;

const EditTask = ({ route, navigation }) => {
    const { taskID } = route.params || {};
    const [parentTaskID, setParentTaskID] = useState(null);
    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
    const [endTime, setEndTime] = useState(new Date());
    const [expectedTime, setExpectedTime] = useState('');
    const [penalty, setPenalty] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [parentPenalty, setParentPenalty] = useState(-1);
    const [newMember, setNewMember] = useState('');
    const [memberList, setMemberList] = useState([]);

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
                TaskName: taskName,
                TaskDetail: taskDetail,
                EndTime: endTime.toISOString(),
                ExpectedTime: parseInt(expectedTime) * 60,
                Penalty: parseInt(penalty),
            };

            console.log('提交的任務數據:', taskData);

            const response = await fetch(`${backend_url}/tasks/${taskID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const newTask = await response.json();
                const taskID = newTask.TaskID;
                for (const member of memberList) {
                    const memberData = await fetch(`${backend_url}/users/by-username/${member}`);
                    const memberID = (await memberData.json()).UserID;
                    const memberResponse = await fetch(`${backend_url}/tasks/${taskID}/members`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ UserID: memberID }),
                    });
                    if (!memberResponse.ok) {
                        const errorData = await memberResponse.json();
                        console.error(`添加成員 ${member} 失敗:`, errorData);
                    } else {
                        console.log(`成員 ${member} 已成功添加到任務 ${taskID}`);
                    }
                }

                setTaskName('');
                setTaskDetail('');
                setEndTime(new Date());
                setExpectedTime('');
                setPenalty('');
                setShowPicker(false);
                setIsLoading(false);
                setMemberList([]);
                setNewMember('');

                alert('成功', '任務已新增！', [
                    {
                        text: '確定',
                        onPress: () => navigation.goBack(),
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

    const handleDelete = async () => {
        if (!taskID) {
            alert('錯誤', '未找到任務ID，無法刪除。');
            return;
        }
        setIsLoading(true);
        try {
            console.log('正在刪除任務:', taskID);
            const res = await fetch(`${backend_url}/tasks/${taskID}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ TaskID: taskID }),
            });
            if (res.ok) {
                alert('成功', '任務已刪除！', [
                    { text: '確定', }
                ]);
            } else {
                const errorData = await res.json();
                alert('錯誤', `刪除任務失敗: ${errorData.message}`);
                console.error('刪除任務失敗:', errorData);
            }
            navigation.goBack();
        } catch (error) {
            console.error('刪除任務時發生錯誤:', error);
            alert('錯誤', '刪除任務時發生錯誤，請稍後再試。');
        } finally {
            setIsLoading(false);
        }
    }

    const getParentPenalty = async () => {
        if (!parentTaskID || parentTaskID === "NULL") return;

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

    const appendMember = async () => {
        if (!newMember) {
            alert('請輸入成員名稱！');
            return;
        }
        if (memberList.includes(newMember)) {
            alert('成員已存在！');
            return;
        }
        const res = await fetch(`${backend_url}/users/by-username/${newMember}`);
        if (res.ok) {
            const user = await res.json();
            if (user) {
                setMemberList([...memberList, newMember]);
            } else {
                alert('錯誤', `未找到用戶 ${newMember}。`);
            }
        } else {
            alert('錯誤', '無法找到該成員，請確認用戶名是否正確。');
        }
    }

    const getDefaultTaskData = async () => {
        if (!taskID) return;
        try {
            const response = await fetch(`${backend_url}/tasks/${taskID}`);
            if (response.ok) {
                const taskData = (await response.json()).task;
                setTaskName(taskData.TaskName);
                setTaskDetail(taskData.TaskDetail);
                setEndTime(new Date(taskData.EndTime.seconds * 1000));
                setExpectedTime((taskData.ExpectedTime / 60).toString());
                setPenalty(taskData.Penalty.toString());
                setParentTaskID(taskData.Parent);
                console.log(taskData);
                // if (taskData.Members) {
                //     setMemberList(taskData.Members.map(member => member.Username));
                // }
            } else {
                console.error('獲取任務失敗:', response.statusText);
            }
        } catch (error) {
            console.error('獲取任務時發生錯誤:', error);
            alert('錯誤', '獲取任務時發生錯誤，請稍後再試。');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDefaultTaskData();
    }, [taskID]);

    useEffect(() => {
        getParentPenalty();
    }, [parentTaskID]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
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
                    <Text style={[styles.input, { marginTop: 10 }]}>截止時間：{endTime.toLocaleString("zh-TW", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }).replace(/\//g, "/")}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="預計所需時間（分鐘）"
                        value={expectedTime}
                        keyboardType="numeric"
                        onChangeText={setExpectedTime}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="重要性 (1-10)"
                        value={penalty}
                        keyboardType="numeric"
                        onChangeText={setPenalty}
                    />
                    {
                        memberList.length > 0 && (
                            <View style={styles.memberList}>
                                {memberList.map((member, index) => (
                                    <Pressable key={index} onPress={() => {
                                        setMemberList(memberList.filter(m => m !== member));
                                    }}>
                                        <View>
                                            <Text style={styles.memberItem}>{member}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        )
                    }
                    <TextInput
                        style={styles.lastInput}
                        placeholder="新增成員"
                        value={newMember}
                        onChangeText={setNewMember}
                    />
                    <Pressable style={styles.button} onPress={() => appendMember()}>
                        <View><Text style={styles.buttonText}>新增成員</Text></View>
                    </Pressable>
                </View>
                <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSubmit} disabled={isLoading}>
                    <View><Text style={styles.buttonText}>更新</Text></View>
                </Pressable>
                <Pressable style={[styles.button, isLoading && styles.buttonDisabled, styles.deleteButton]} onPress={handleDelete} disabled={isLoading}>
                    <View><Text style={styles.buttonText}>刪除</Text></View>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default EditTask;