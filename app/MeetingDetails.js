import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, Pressable } from "react-native"
import { fetchUserTask, fetchTaskGroup } from "@/firebaseAPI"
import { Picker } from "@react-native-picker/picker"
import styles from './MeetingDetails.styles';
import AsyncStorage from '@react-native-async-storage/async-storage'

// import styles from "./MeetingDetails.styles"

const backend_url = 'http://192.168.199.81:3000';

const MeetingDetails = ({ route, navigation }) => {
    const { meetingID } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [expectedTime, setExpectedTime] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMeetingDetails = async () => {
        if (!meetingID) {
            alert("錯誤", "未找到會議ID，請先選擇會議。");
            return;
        }

        setIsLoading(true);
        try {
            const userID = await AsyncStorage.getItem('userID');
            if (!userID) {
                alert("錯誤", "未找到用戶ID，請先登入。");
                return;
            }

            const res = await fetch(`${backend_url}/users/${userID}/meetings/${meetingID}`);
            if (res.ok) {
                const data = await res.json();
                setTitle(data.MeetingName || '');
                setDescription(data.Description || '');
                setDate(new Date(data.StartTime));
                setExpectedTime(data.ExpectedTime || '');
            } else {
                const errorData = await res.json();
                console.error("Error fetching meeting details: ", errorData);
                alert("錯誤", "無法獲取會議詳細資料，請稍後再試。");
            }
        } catch (error) {
            console.error("Failed to fetch meeting details: ", error);
            alert("錯誤", "無法獲取會議詳細資料，請稍後再試。");
        } finally {
            setIsLoading(false);
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
        </ScrollView>
    );
}

export default MeetingDetails;