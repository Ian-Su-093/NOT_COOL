import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, Pressable } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './EditMeeting.styles';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocalIP } from "./util/helpers";
// import styles from "./MeetingDetails.styles"

const backend_url = `http://${getLocalIP()}:3000`;

const EditMeeting = ({ route, navigation }) => {
    const { meetingID } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [expectedTime, setExpectedTime] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [taskID, setTaskID] = useState('');

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
                setDescription(data.MeetingDetail || '');
                setDate(new Date(data.StartTime));
                setExpectedTime((data.Duration / 60).toString() || '');
                setTaskID(data.TaskID || '');
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

            const response = await fetch(`${backend_url}/meetings/${meetingID}`, {
                method: 'PUT',
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

    const handleDelete = async () => {
        if (!meetingID) {
            alert("錯誤", "未找到會議ID，請先選擇會議。");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${backend_url}/meetings/${meetingID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("會議刪除成功");
                alert('成功', '已刪除！', [
                    { text: '確定' }
                ]);
                navigation.goBack();
            } else {
                const errorData = await response.json();
                console.error("Error deleting meeting:", errorData);
                alert('刪除會議失敗，請稍後再試。');
            }
        } catch (error) {
            console.error("Error deleting meeting:", error);
            alert('刪除會議失敗，請稍後再試。');
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
            <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={() => handleSubmit()} disabled={isLoading}>
                <View><Text style={styles.buttonText}>儲存</Text></View>
            </Pressable>
            <Pressable style={[styles.button, isLoading && styles.buttonDisabled, styles.deleteButton]} onPress={() => handleDelete()} disabled={isLoading}>
                <View><Text style={styles.buttonText}>刪除</Text></View>
            </Pressable>
        </ScrollView>
    );
}

export default EditMeeting;