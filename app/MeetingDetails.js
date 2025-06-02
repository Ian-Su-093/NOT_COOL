import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, Pressable } from "react-native"
import styles from './MeetingDetails.styles';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocalIP } from "./util/helpers";
// import styles from "./MeetingDetails.styles"

const backend_url = `http://${getLocalIP()}:3000`;

const MeetingDetails = ({ route, navigation }) => {
    const { meetingID } = route.params || {};

    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [date, setDate] = useState(new Date());
    const [duration, setDuration] = useState('');
    const [taskName, setTaskName] = useState('');

    const fetchMeetingDetails = async () => {
        if (!meetingID) {
            alert("錯誤", "未找到會議ID，請先選擇會議。");
            return;
        }
        try {
            const userID = await AsyncStorage.getItem('userID');
            if (!userID) {
                alert("錯誤", "未找到用戶ID，請先登入。");
                return;
            }

            const res = await fetch(`${backend_url}/meetings/${meetingID}`);
            if (res.ok) {
                const data = (await res.json()).meeting;
                setTitle(data.MeetingName || '');
                setDetail(data.MeetingDetail || '');
                setDate(new Date(data.StartTime));
                setDuration(data.Duration || '');
                const taskRes = await fetch(`${backend_url}/tasks/${data.TaskID}`);
                if (taskRes.ok) {
                    const taskData = (await taskRes.json()).task;
                    setTaskName(taskData.TaskName || '');
                } else {
                    console.error("Error fetching task details: ", await taskRes.json());
                }
            } else {
                const errorData = await res.json();
                console.error("Error fetching meeting details: ", errorData);
                alert("錯誤", "無法獲取會議詳細資料，請稍後再試。");
            }
        } catch (error) {
            console.error("Failed to fetch meeting details: ", error);
            alert("錯誤", "無法獲取會議詳細資料，請稍後再試。");
        }
    }

    useEffect(() => {
        fetchMeetingDetails();
    }, [meetingID]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>會議資訊</Text>
            <View style={styles.infoBox}>
                <Text style={styles.input}>{title}</Text>
                <Text style={styles.inputArea}>{detail}</Text>
                <Text style={[styles.input, { paddingTop: 3 }]}>會議時間：{date.toLocaleDateString("zh-TW", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).replace(/\//g, "/")}</Text>
                <Text style={styles.input}>
                    時長：{duration / 60 || '無'} 分鐘
                </Text>
                <Text style={styles.lastInput}>
                    所屬任務：{taskName || '無'}
                </Text>
            </View>
            <Pressable style={styles.button} onPress={() => navigation.navigate('EditMeeting', { meetingID: meetingID })}>
                <View><Text style={styles.buttonText}>編輯</Text></View>
            </Pressable>
        </ScrollView>
    );
}

export default MeetingDetails;