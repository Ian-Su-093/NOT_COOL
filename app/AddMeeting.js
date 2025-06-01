import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, Pressable } from "react-native"
import { fetchUserTask, fetchTaskGroup } from "@/firebaseAPI"
import { Picker } from "@react-native-picker/picker"
import styles from './AddMeeting.styles';
import AsyncStorage from '@react-native-async-storage/async-storage'

// import styles from "./MeetingDetails.styles"

const backend_url = 'http://192.168.199.81:3000';

const AddMeeting = ({ route, navigation }) => {
    const { taskID } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [expectedTime, setExpectedTime] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !description || !date || !expectedTime) {
            alert('請填寫所有欄位！');
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

            const meetingData = {
                // UserID: userID,
                TaskID: taskID,
                MeetingName: title,
                MeetingDetail: description,
                Duration: parseInt(expectedTime) * 60,
                StartTime: date.toISOString(),
            };

            console.log('提交的會議數據:', meetingData);

            const response = await fetch(`${backend_url}/meetings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(meetingData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("會議提交成功:", data);


                setTitle('');
                setDescription('');
                setDate(new Date());
                setExpectedTime('');
                setIsLoading(false);

                alert('成功', '已新增！', [
                    { text: '確定', }
                ]);
            } else {
                const errorData = await response.json();
                console.error("Error submitting meeting:", errorData);
                alert('新增會議失敗，請稍後再試。');
                setIsLoading(false);
                return;
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error submitting meeting:", error);
            alert('新增會議失敗，請稍後再試。');
            setIsLoading(false);
            return;
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoBox}>
                <TextInput
                    style={styles.input}
                    placeholder="會議標題"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.inputArea}
                    placeholder="會議描述"
                    value={description}
                    onChangeText={setDescription}
                />
                <Pressable style={styles.button} onPress={() => setShowPicker(true)}>
                    <View><Text style={styles.buttonText}>選擇會議時間</Text></View>
                </Pressable>
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={(event, date) => {
                            setShowPicker(false);
                            if (date) {
                                setDate(date);
                            }
                        }}
                    />
                )}
                <Text style={[styles.input, { marginTop: 10 }]}>會議時間：{date.toLocaleDateString("zh-TW", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).replace(/\//g, "/")}</Text>

                <TextInput
                    style={styles.lastInput}
                    placeholder="預計所需時間（分鐘）"
                    value={expectedTime}
                    keyboardType="numeric"
                    onChangeText={setExpectedTime}
                />
            </View>
            <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={() => handleSubmit()} disabled={isLoading}>
                <View><Text style={styles.buttonText}>新增</Text></View>
            </Pressable>
        </ScrollView>
    );
}

export default AddMeeting;